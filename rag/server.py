"""
FastAPI RAG server — exposes /search over the ChromaDB vector store.

Run:  uvicorn server:app --port 8001 --reload
"""

import os
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.insert(0, os.path.dirname(__file__))
from vectorstore import VectorStore

_store: VectorStore | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _store
    _store = VectorStore()
    print(f"[RAG] Vector store loaded — {_store.count()} chunks indexed")
    yield


app = FastAPI(title="Immigration RAG Server", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://auvtracker.web.app",
        "https://auvtracker.firebaseapp.com",
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str
    n_results: int = 5
    min_score: float = 0.3


class ChunkResult(BaseModel):
    content: str
    url: str
    title: str
    department: str
    source_name: str
    score: float


class SearchResponse(BaseModel):
    results: list[ChunkResult]
    total_chunks: int


@app.get("/health")
def health():
    count = _store.count() if _store else 0
    return {"status": "ok", "indexed_chunks": count}


@app.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    if not _store or _store.count() == 0:
        return SearchResponse(results=[], total_chunks=0)

    raw = _store.search(req.query, n_results=req.n_results)
    filtered = [r for r in raw if r["score"] >= req.min_score]

    return SearchResponse(
        results=[ChunkResult(**r) for r in filtered],
        total_chunks=_store.count(),
    )
