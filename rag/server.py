"""
FastAPI RAG server — exposes /search over the ChromaDB vector store.
Includes async token-bucket rate limiting per client IP.

Run:  uvicorn server:app --port 8001 --reload
"""

import asyncio
import os
import sys
import time
from contextlib import asynccontextmanager
from dataclasses import dataclass, field

from fastapi import FastAPI, HTTPException, Request
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


# ── Token Bucket ──────────────────────────────────────────────────────────────

@dataclass
class TokenBucket:
    """Async token bucket: refills at `refill_rate` tokens/s up to `capacity`."""
    capacity: float = 10.0
    refill_rate: float = 5.0
    tokens: float = field(init=False)
    _last_refill: float = field(init=False)
    _lock: asyncio.Lock = field(init=False)

    def __post_init__(self):
        self.tokens = self.capacity
        self._last_refill = time.monotonic()
        self._lock = asyncio.Lock()

    def _refill(self):
        now = time.monotonic()
        elapsed = now - self._last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self._last_refill = now

    def try_acquire(self, amount: float = 1.0) -> tuple[bool, float]:
        """Non-blocking check. Returns (allowed, retry_after_seconds)."""
        self._refill()
        if self.tokens >= amount:
            self.tokens -= amount
            return True, 0.0
        retry_after = (amount - self.tokens) / self.refill_rate
        return False, retry_after


# ── Per-IP Rate Limiter ───────────────────────────────────────────────────────

class PerIpRateLimiter:
    def __init__(self, capacity: float = 5.0, refill_rate: float = 1.0):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self._buckets: dict[str, TokenBucket] = {}

    def _get_bucket(self, ip: str) -> TokenBucket:
        if ip not in self._buckets:
            self._buckets[ip] = TokenBucket(
                capacity=self.capacity,
                refill_rate=self.refill_rate,
            )
        return self._buckets[ip]

    def _evict_idle(self):
        """Remove buckets that have fully refilled (idle clients)."""
        to_delete = [
            ip for ip, b in self._buckets.items()
            if b.tokens >= b.capacity
        ]
        for ip in to_delete:
            del self._buckets[ip]

    def check(self, request: Request):
        """FastAPI dependency — raises 429 if the client IP is over the limit."""
        forwarded = request.headers.get("x-forwarded-for")
        ip = forwarded.split(",")[0].strip() if forwarded else (
            request.client.host if request.client else "unknown"
        )

        bucket = self._get_bucket(ip)
        allowed, retry_after = bucket.try_acquire(1.0)

        if not allowed:
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Too many requests — please slow down.",
                    "retryAfterSeconds": round(retry_after, 2),
                },
                headers={
                    "Retry-After": str(int(retry_after) + 1),
                    "X-RateLimit-Limit": str(int(self.capacity)),
                    "X-RateLimit-Remaining": "0",
                },
            )

        # Opportunistically evict idle buckets to keep memory bounded.
        if len(self._buckets) > 500:
            self._evict_idle()


# Burst of 5 requests, refill 1/s per IP.
_search_limiter = PerIpRateLimiter(capacity=5.0, refill_rate=1.0)


# ── Request / Response Models ─────────────────────────────────────────────────

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


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    count = _store.count() if _store else 0
    return {"status": "ok", "indexed_chunks": count}


@app.post("/search", response_model=SearchResponse)
def search(req: SearchRequest, request: Request):
    _search_limiter.check(request)

    if not _store or _store.count() == 0:
        return SearchResponse(results=[], total_chunks=0)

    raw = _store.search(req.query, n_results=req.n_results)
    filtered = [r for r in raw if r["score"] >= req.min_score]

    return SearchResponse(
        results=[ChunkResult(**r) for r in filtered],
        total_chunks=_store.count(),
    )
