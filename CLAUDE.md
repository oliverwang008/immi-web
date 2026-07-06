# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**AussieVisa Tracker** (deployed at auvtracker.web.app) — a community-driven platform tracking Australian skilled-visa processing times and EOI statistics, plus an AI immigration consultant chat. The repo root is the Next.js app (`immi-web/`); two backend services live in subfolders (`api-server/`, `rag/`).

## Commands

All run from this directory (`immi-web/`) unless noted.

```bash
npm run dev        # Next.js dev server on :3000 (API routes under src/app/api DO run here)
npm run build      # Static export to ./out  (output: "export" — there is NO Next server in prod)
npm run lint       # next lint
npm run deploy     # next build && firebase deploy --only hosting

node scripts/backfill-app-dates.mjs   # one-off Firestore data migration (uses firebase-admin)
```

RAG service (`rag/`, Python ≥3.11):
```bash
pip install -r requirements.txt
python main.py ingest          # scrape official gov sites + index curated docs into ChromaDB
python main.py ingest --clear  # wipe DB then re-ingest everything
python main.py ingest-docs     # (re)index only docs/immigration/*.md — markdown-aware, no scraping
python main.py stats           # DB stats
python main.py chat            # interactive terminal RAG chat
uvicorn server:app --port 8001 --reload   # serve /search (what the chat API calls)
```

API service (`api-server/`, Node ≥20, ESM):
```bash
npm install && npm run dev     # node --watch server.js on :8080
```

There is no test suite.

## Architecture — the critical part

This is **three deployed services**, and the most important thing to understand is that **`next.config.mjs` sets `output: "export"`**, so the production site is fully static HTML in `out/`. **The App Router API routes in `src/app/api/*` do NOT exist in production.** They run only under `next dev`.

In production, `firebase.json` rewrites `/api/**` to a Cloud Run service (`immi-web-api`, region `australia-southeast1`). That service is **`api-server/server.js`** — a hand-maintained Express mirror of the Next API routes.

> **Consequence:** any change to a `src/app/api/*` route (chat, immigration-news) must be mirrored into `api-server/server.js` (and `api-server/immigration-news.js`) or it won't take effect in prod. The system prompt, RAG wiring, and news logic are duplicated across both. The `api-server/` copy is the source of truth for prod behaviour (e.g. it adds per-IP rate limiting and cost tracking that the Next route lacks).

Data / request flow:

1. **Frontend (static)** — Next.js App Router, client components, Tailwind, Firestore SDK read directly from the browser. Pages: `/` (dashboard), `/submit`, `/news`, `/ai-agent` (chat), `/weather`, `/terms`.
2. **Firestore** — `submissions` collection is the entire datastore. Rules (`firestore.rules`) allow public read + create, no update/delete. All access goes through `src/lib/firestore.ts`; `src/lib/firebase.ts` only initialises the client SDK in the browser (`typeof window` guard). Aggregation/stats are computed client-side in `firestore.ts` from raw docs — there is no backend aggregation.
3. **api-server (Cloud Run, Express)** — handles `/api/chat` (Anthropic streaming SSE) and `/api/immigration-news`. Calls the RAG service for context.
4. **rag (Cloud Run, FastAPI + ChromaDB)** — `POST /search` does semantic retrieval over two corpora in one collection: scraped official `immi.homeaffairs.gov.au` + state migration sites (`rag/sites.py`, via `rag/scraper.py`), and the curated reference docs in `docs/immigration/*.md` (`rag/curated_docs.py`, markdown-aware chunking). Also hosts a weather agent. The chat APIs call it with a 3s timeout and **degrade gracefully to zero context** if it's slow/down.

### Chat / RAG pattern

`fetchRagContext` retrieves up to 5 chunks for the latest user message, wraps them in a `<government_sources>` block prepended to that message, streams the Anthropic response as SSE (`data: <json-string>\n\n`), then appends a "sources consulted" markdown footer as a final chunk. The system prompt is large and uses `cache_control: ephemeral` for prompt caching.

## Conventions & gotchas

- **Model IDs:** chat uses `claude-sonnet-4-6`; the weather agent uses `claude-opus-4-8`. Anthropic SDK is `@anthropic-ai/sdk` (note the two copies pin different versions — Next app `^0.96.0`, api-server `^0.40.0`).
- **Australian English** throughout user-facing copy (recognised, organisation, licence). The chat must always include the MARA legal-advice disclaimer — preserve it when editing the system prompt.
- **i18n:** UI strings live in `src/i18n/translations.ts` driven by `src/contexts/LanguageContext.tsx`. Visa/occupation/points reference data is in `src/data/` (`visas.ts`, `occupations.ts`, `points.ts`).
- **VisaSubmission schema** (`src/lib/firestore.ts`) carries legacy fields (`countryOfOrigin`, `statuses[]`) kept for back-compat alongside the current `currentStatus` + dated event fields — don't remove them.
- **Env vars:** copy `.env.local.example` → `.env.local`. `NEXT_PUBLIC_FIREBASE_*` are browser-exposed; `ANTHROPIC_API_KEY` and `RAG_SERVER_URL` are server-only (used by api-server / the dev API route).
- `out/` is the build artifact and `.next/` is the build cache — never edit by hand.

## Sibling folder

`../ai-engineer-lab/` is an unrelated scratch project (separate git repo) and not part of this app.
