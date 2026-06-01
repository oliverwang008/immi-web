"""
Claude-powered immigration advisor agent with RAG over official government sources.
Uses prompt caching on the system prompt for efficiency.
Retries transient Anthropic API errors with exponential backoff.
"""

import os
from dataclasses import dataclass, field

import anthropic
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from vectorstore import VectorStore, SearchResult

MODEL = "claude-sonnet-4-6"
MAX_CONTEXT_CHUNKS = 6
MIN_RELEVANCE_SCORE = 0.3


# ── Cost Tracker ──────────────────────────────────────────────────────────────

@dataclass
class CostTracker:
    """Track token usage and estimated USD cost. Claude Sonnet 4.6 pricing."""
    INPUT_COST_PER_1M:       float = 3.00
    OUTPUT_COST_PER_1M:      float = 15.00
    CACHE_READ_COST_PER_1M:  float = 0.30
    CACHE_WRITE_COST_PER_1M: float = 3.75

    input_tokens:       int = 0
    output_tokens:      int = 0
    cache_read_tokens:  int = 0
    cache_write_tokens: int = 0
    requests:           int = 0

    def record(self, usage: anthropic.types.Usage):
        self.input_tokens       += usage.input_tokens
        self.output_tokens      += usage.output_tokens
        self.cache_read_tokens  += getattr(usage, "cache_read_input_tokens", 0) or 0
        self.cache_write_tokens += getattr(usage, "cache_creation_input_tokens", 0) or 0
        self.requests += 1

    @property
    def cost_usd(self) -> float:
        return (
            self.input_tokens       / 1_000_000 * self.INPUT_COST_PER_1M
            + self.output_tokens    / 1_000_000 * self.OUTPUT_COST_PER_1M
            + self.cache_read_tokens  / 1_000_000 * self.CACHE_READ_COST_PER_1M
            + self.cache_write_tokens / 1_000_000 * self.CACHE_WRITE_COST_PER_1M
        )

    def report(self) -> str:
        return (
            f"Requests: {self.requests} | "
            f"In: {self.input_tokens} | Out: {self.output_tokens} | "
            f"Cache read: {self.cache_read_tokens} | Cache write: {self.cache_write_tokens} | "
            f"Est. cost: ${self.cost_usd:.6f}"
        )


# ── System Prompt ─────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an expert Australian immigration advisor. You answer questions \
using ONLY the official government sources provided in the context below.

Guidelines:
- Cite the source URL for every fact you state
- If the retrieved context does not contain enough information, say so clearly and \
  direct the user to the relevant government website
- Never invent visa subclasses, processing times, or fee amounts
- Always recommend consulting a registered migration agent (MARA) for personalised advice
- Use plain English — avoid jargon unless necessary, and explain it when you do
- Format responses with clear headings and bullet points where helpful

Official sources you have access to:
Federal:
- Department of Home Affairs (immi.homeaffairs.gov.au, homeaffairs.gov.au)
- Australian Border Force (abf.gov.au)
- Jobs and Skills Australia (jobsandskills.gov.au)
- Administrative Review Tribunal (art.gov.au)
- Austrade (austrade.gov.au)
- Department of Education (education.gov.au)
- Services Australia (servicesaustralia.gov.au)
- Australian Bureau of Statistics (abs.gov.au)
State & Territory Nomination Programs:
- NSW (nsw.gov.au)
- Victoria (liveinmelbourne.vic.gov.au)
- Queensland (migration.qld.gov.au)
- South Australia (migration.sa.gov.au)
- Western Australia (migration.wa.gov.au)
- Tasmania (migration.tas.gov.au)
- ACT (canberrayourfuture.com.au)
- Northern Territory (nt.gov.au/migration)
"""


# ── Context Formatting ────────────────────────────────────────────────────────

def _format_context(results: list[SearchResult]) -> str:
    parts = [
        f"[Source: {r['department']} — {r['url']}]\n{r['content']}"
        for r in results
        if r["score"] >= MIN_RELEVANCE_SCORE
    ]
    return "\n\n---\n\n".join(parts) if parts else "No relevant government information found."


def _format_sources(results: list[SearchResult]) -> str:
    seen: dict[str, str] = {}
    for r in results:
        if r["score"] >= MIN_RELEVANCE_SCORE and r["url"] not in seen:
            seen[r["url"]] = r["title"]
    if not seen:
        return ""
    lines = ["\n**Sources consulted:**"]
    lines += [f"- [{title}]({url})" for url, title in seen.items()]
    return "\n".join(lines)


# ── Agent ─────────────────────────────────────────────────────────────────────

class ImmigrationAgent:
    def __init__(self, vector_store: VectorStore = None):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise EnvironmentError("ANTHROPIC_API_KEY not set")
        self._client = anthropic.Anthropic(api_key=api_key)
        self._store = vector_store or VectorStore()
        self._history: list[dict] = []
        self.costs = CostTracker()

    def _retrieve(self, query: str) -> list[SearchResult]:
        return self._store.search(query, n_results=MAX_CONTEXT_CHUNKS)

    @retry(
        retry=retry_if_exception_type(anthropic.APIError),
        wait=wait_exponential(multiplier=1, min=1, max=30),
        stop=stop_after_attempt(4),
        reraise=True,
    )
    def _call_api(self, messages: list[dict]) -> anthropic.types.Message:
        return self._client.messages.create(
            model=MODEL,
            max_tokens=2048,
            system=[
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=messages,
        )

    def chat(self, user_message: str) -> str:
        results = self._retrieve(user_message)
        context = _format_context(results)
        sources_footer = _format_sources(results)

        augmented_user = (
            f"<government_sources>\n{context}\n</government_sources>\n\n"
            f"User question: {user_message}"
        )
        self._history.append({"role": "user", "content": augmented_user})

        response = self._call_api(self._history)
        self.costs.record(response.usage)

        reply = response.content[0].text
        self._history.append({"role": "assistant", "content": reply})

        return reply + sources_footer if sources_footer else reply

    def reset(self):
        self._history.clear()
