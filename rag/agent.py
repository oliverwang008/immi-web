"""
Claude-powered immigration advisor agent with RAG over official government sources.
Uses prompt caching on the system prompt for efficiency.
"""

import os
import anthropic
from vectorstore import VectorStore, SearchResult

MODEL = "claude-sonnet-4-6"
MAX_CONTEXT_CHUNKS = 6
MIN_RELEVANCE_SCORE = 0.3


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


def _format_context(results: list[SearchResult]) -> str:
    if not results:
        return "No relevant government information found for this query."

    parts = []
    seen_urls = set()
    for r in results:
        if r["score"] < MIN_RELEVANCE_SCORE:
            continue
        url = r["url"]
        if url not in seen_urls:
            seen_urls.add(url)
        parts.append(
            f"[Source: {r['department']} — {r['url']}]\n{r['content']}"
        )

    return "\n\n---\n\n".join(parts) if parts else "No sufficiently relevant results found."


def _format_sources(results: list[SearchResult]) -> str:
    seen = {}
    for r in results:
        if r["score"] >= MIN_RELEVANCE_SCORE and r["url"] not in seen:
            seen[r["url"]] = r["title"]
    if not seen:
        return ""
    lines = ["\n**Sources consulted:**"]
    for url, title in seen.items():
        lines.append(f"- [{title}]({url})")
    return "\n".join(lines)


class ImmigrationAgent:
    def __init__(self, vector_store: VectorStore = None):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise EnvironmentError("ANTHROPIC_API_KEY not set")
        self._client = anthropic.Anthropic(api_key=api_key)
        self._store = vector_store or VectorStore()
        self._history: list[dict] = []

    def _retrieve(self, query: str) -> list[SearchResult]:
        return self._store.search(query, n_results=MAX_CONTEXT_CHUNKS)

    def chat(self, user_message: str) -> str:
        results = self._retrieve(user_message)
        context = _format_context(results)
        sources_footer = _format_sources(results)

        # Inject retrieved context into user turn
        augmented_user = (
            f"<government_sources>\n{context}\n</government_sources>\n\n"
            f"User question: {user_message}"
        )

        self._history.append({"role": "user", "content": augmented_user})

        response = self._client.messages.create(
            model=MODEL,
            max_tokens=2048,
            system=[
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},  # prompt caching
                }
            ],
            messages=self._history,
        )

        reply = response.content[0].text
        self._history.append({"role": "assistant", "content": reply})

        return reply + sources_footer if sources_footer else reply

    def reset(self):
        self._history.clear()
