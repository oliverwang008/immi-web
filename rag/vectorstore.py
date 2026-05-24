"""
ChromaDB vector store for immigration documents.
Uses sentence-transformers for local embeddings.
"""

import os
import hashlib
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import TypedDict

DB_PATH = os.path.join(os.path.dirname(__file__), ".chroma_db")
COLLECTION_NAME = "australian_immigration"
EMBED_MODEL = "all-MiniLM-L6-v2"  # fast, 384-dim, good for semantic search


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

    def count(self) -> int:
        return self._collection.count()

    def clear(self):
        self._client.delete_collection(COLLECTION_NAME)
        self._collection = self._client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
