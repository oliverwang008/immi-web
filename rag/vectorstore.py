"""
ChromaDB vector store for immigration documents.
Uses sentence-transformers for local embeddings, plus an in-memory BM25 index
for hybrid (keyword + semantic) retrieval fused with Reciprocal Rank Fusion.
"""

import os
import re
import hashlib
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import TypedDict

DB_PATH = os.path.join(os.path.dirname(__file__), ".chroma_db")
COLLECTION_NAME = "australian_immigration"
EMBED_MODEL = "all-MiniLM-L6-v2"  # fast, 384-dim, good for semantic search

RRF_K = 60  # Reciprocal Rank Fusion constant (standard default)

# Keeps digits so exact tokens survive: "189", "482", "csit", "mltssl".
_TOKEN_RE = re.compile(r"[a-z0-9]+")


def _tokenize(text: str) -> list[str]:
    return _TOKEN_RE.findall(text.lower())


class SearchResult(TypedDict):
    content: str
    url: str
    title: str
    department: str
    source_name: str
    score: float


class VectorStore:
    def __init__(self, persist_path: str = DB_PATH):
        self._embedder = SentenceTransformer(EMBED_MODEL)
        self._client = chromadb.PersistentClient(
            path=persist_path,
            settings=Settings(anonymized_telemetry=False),
        )
        self._collection = self._client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
        # Lazily-built BM25 index over the full corpus (see _ensure_bm25).
        self._bm25 = None
        self._ids: list[str] = []
        self._docs: list[str] = []
        self._metas: list[dict] = []
        self._id_to_idx: dict[str, int] = {}

    def _embed(self, texts: list[str]) -> list[list[float]]:
        return self._embedder.encode(texts, show_progress_bar=False).tolist()

    def _chunk_id(self, url: str, chunk_index: int) -> str:
        h = hashlib.md5(f"{url}:{chunk_index}".encode()).hexdigest()[:12]
        return f"chunk_{h}"

    def add_document(self, doc) -> int:
        """Add a scraped Document to the store. Returns number of chunks added."""
        if not doc.chunks:
            return 0

        ids = [self._chunk_id(doc.url, i) for i in range(len(doc.chunks))]
        existing = self._collection.get(ids=ids, include=[])["ids"]
        existing_set = set(existing)

        new_chunks, new_ids, new_meta = [], [], []
        for i, (chunk, cid) in enumerate(zip(doc.chunks, ids)):
            if cid not in existing_set:
                new_chunks.append(chunk)
                new_ids.append(cid)
                new_meta.append({
                    "url": doc.url,
                    "title": doc.title,
                    "department": doc.department,
                    "source_name": doc.source_name,
                    "chunk_index": i,
                })

        if not new_chunks:
            return 0

        embeddings = self._embed(new_chunks)
        self._collection.add(
            ids=new_ids,
            embeddings=embeddings,
            documents=new_chunks,
            metadatas=new_meta,
        )
        self._bm25 = None  # corpus changed — rebuild lazily on next hybrid search
        return len(new_chunks)

    def search(self, query: str, n_results: int = 5) -> list[SearchResult]:
        """Semantic search over stored chunks."""
        embedding = self._embed([query])[0]
        results = self._collection.query(
            query_embeddings=[embedding],
            n_results=n_results,
            include=["documents", "metadatas", "distances"],
        )

        output: list[SearchResult] = []
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ):
            output.append(SearchResult(
                content=doc,
                url=meta["url"],
                title=meta["title"],
                department=meta["department"],
                source_name=meta["source_name"],
                score=1.0 - dist,  # cosine similarity
            ))
        return output

    def _ensure_bm25(self) -> None:
        """Build the in-memory BM25 index from the full corpus, once.

        Loads every chunk's document + metadata into parallel arrays so BM25
        ranks can be fused with vector ranks by chunk id. Cheap at this scale;
        invalidated (set to None) whenever the collection changes.
        """
        if self._bm25 is not None:
            return
        data = self._collection.get(include=["documents", "metadatas"])
        self._ids = data["ids"]
        self._docs = data["documents"]
        self._metas = data["metadatas"]
        self._id_to_idx = {cid: i for i, cid in enumerate(self._ids)}
        if not self._docs:
            return
        from rank_bm25 import BM25Okapi
        self._bm25 = BM25Okapi([_tokenize(d) for d in self._docs])

    def hybrid_search(self, query: str, n_results: int = 5) -> list[SearchResult]:
        """Fuse BM25 keyword ranks with vector cosine ranks via RRF.

        Returns SearchResult whose `score` is the RRF score (a small fused
        rank sum, NOT a cosine similarity — don't compare it to a 0-1 cutoff).
        Falls back to pure vector search if the corpus is empty/unindexed.
        """
        self._ensure_bm25()
        if self._bm25 is None:
            return self.search(query, n_results)

        pool = max(25, n_results * 5)
        count = len(self._ids)

        # Vector ranks (ids are always returned by Chroma).
        embedding = self._embed([query])[0]
        vres = self._collection.query(
            query_embeddings=[embedding],
            n_results=min(pool, count),
        )
        vec_ids = vres["ids"][0]

        # BM25 ranks.
        scores = self._bm25.get_scores(_tokenize(query))
        bm25_order = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
        bm25_ids = [self._ids[i] for i in bm25_order[:pool] if scores[i] > 0]

        # Reciprocal Rank Fusion.
        fused: dict[str, float] = {}
        for rank, cid in enumerate(vec_ids):
            fused[cid] = fused.get(cid, 0.0) + 1.0 / (RRF_K + rank + 1)
        for rank, cid in enumerate(bm25_ids):
            fused[cid] = fused.get(cid, 0.0) + 1.0 / (RRF_K + rank + 1)

        top = sorted(fused.items(), key=lambda kv: kv[1], reverse=True)[:n_results]
        output: list[SearchResult] = []
        for cid, score in top:
            meta = self._metas[self._id_to_idx[cid]]
            output.append(SearchResult(
                content=self._docs[self._id_to_idx[cid]],
                url=meta["url"],
                title=meta["title"],
                department=meta["department"],
                source_name=meta["source_name"],
                score=score,
            ))
        return output

    def delete_document(self, url: str) -> None:
        """Remove all chunks for a given source url.

        Chunk ids are derived from url + index, so re-adding an edited document
        without deleting first would skip changed chunks (id already exists) and
        orphan any removed tail chunks. Call this before re-adding to refresh.
        """
        self._collection.delete(where={"url": url})
        self._bm25 = None  # corpus changed — rebuild lazily on next hybrid search

    def count(self) -> int:
        return self._collection.count()

    def peek(self, limit: int = 10, source_name: str | None = None) -> dict:
        """Return stored chunks (documents + metadata) without a query.

        Unlike search(), this browses the raw collection. Optionally filter by
        source_name (e.g. "Curated Reference Docs" vs a scraped gov site).
        """
        where = {"source_name": source_name} if source_name else None
        return self._collection.get(
            where=where,
            limit=limit,
            include=["documents", "metadatas"],
        )

    def clear(self):
        self._client.delete_collection(COLLECTION_NAME)
        self._collection = self._client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
        self._bm25 = None  # corpus changed — rebuild lazily on next hybrid search
