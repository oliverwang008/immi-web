# Australian Immigration Reference Library

Reference knowledge for **AussieVisa Tracker** — current (FY2025–26) Australian immigration law and skilled-migration knowledge, compiled for use in future development and to ground the AI immigration consultant (see `src/app/api/chat/route.ts` and `api-server/server.js`).

> ⚠️ **Read this first.** These docs were researched in June 2026 from official Department of Home Affairs sources where reachable, and cross-checked against reputable secondary sources (registered migration agents, law firms) where official pages were JavaScript-rendered or returned HTTP 403 to automated fetching. **Immigration law, fees, thresholds, processing times and state programs change frequently — often on 1 July each year.** Every doc carries a "Last researched" date and an "Items not fully verified" section. Re-verify any figure against the official source before showing it to users. Each doc lists its source URLs.

## Contents

| Doc | What's in it |
|---|---|
| [visa-subclasses.md](visa-subclasses.md) | Skilled & employer-sponsored visas (189, 190, 491→191, 482 Skills in Demand, 186, 494): eligibility, streams, base VACs, indicative processing times, income thresholds (CSIT/SSIT/TSMIT). |
| [points-and-eoi.md](points-and-eoi.md) | Full points test for 189/190/491 (age, English, experience, quals, partner/single, +5/+15 bonuses), the 65-point minimum and real cut-offs, and SkillSelect/EOI mechanics. Notes the **7 Aug 2025 English-test scoring overhaul**. |
| [occupation-lists-and-skills-assessment.md](occupation-lists-and-skills-assessment.md) | CSOL vs MLTSSL/STSOL/ROL (two parallel list regimes since Dec 2024), ANZSCO→OSCA transition, and occupation→assessing-authority tables (VETASSESS, ACS, EA, TRA, etc.). |
| [state-nomination.md](state-nomination.md) | All 8 state/territory 190 & 491 nomination programs: websites, eligibility, occupation-list approach, process model (EOI/ROI/ACT Matrix), and FY2025–26 allocation context. |
| [recent-changes-and-reference.md](recent-changes-and-reference.md) | The Dec 2023 Migration Strategy and its rollout, Skills in Demand visa, salary thresholds, Permanent Migration Program planning levels, NOM trends, bridging visas, Genuine Student, character/health. Has a timeline-of-changes table. |
| [family-partner-and-citizenship.md](family-partner-and-citizenship.md) | Partner (820/801, 309/100, 300), parent (143/173/103), child and other family visas, plus Australian citizenship by conferral and the PR→citizenship pathway. |
| [glossary-and-data-sources.md](glossary-and-data-sources.md) | Glossary of terms/acronyms, and a catalogue of official live data sources/tools (processing-times tool, SkillSelect rounds, occupation ceilings, pricing, ABS NOM, data.gov.au) with update cadence and machine-readability notes. |

## Key things that changed recently (and trip people up)

- **Skills in Demand (SID) visa replaced the TSS subclass 482** (Dec 2024) — streams are now Core Skills, Specialist Skills, and Labour Agreement. The old "Short/Medium/Long-term" framing is gone.
- **Core Skills Occupation List (CSOL)** drives the sponsored pathways (482 Core Skills, 186); the **points-tested 189/190/491 still use MLTSSL/STSOL/ROL** — two parallel list regimes coexist.
- **OSCA** (Occupation Standard Classification for Australia, ABS, Dec 2024) is the eventual replacement for **ANZSCO**, but skilled migration still references ANZSCO codes — confirm which the app should store.
- **Income thresholds renamed and indexed annually on 1 July**: TSMIT → **CSIT** (core) and **SSIT** (specialist).
- **English-test scoring overhaul (7 Aug 2025)** — OET moved to numerical scoring, PTE per-component minimums; legacy score sets apply to earlier tests.

## How this maps to the codebase

- Reference data the app currently hard-codes lives in `src/data/` (`visas.ts`, `occupations.ts`, `points.ts`) — these docs are the authority to check it against.
- The AI consultant's system prompt (duplicated in `src/app/api/chat/route.ts` and `api-server/server.js`) should stay consistent with these docs; the RAG service (`rag/`) scrapes the same official sources listed here.
- For live/ingestable data, see the "Official data sources & tools" catalogue in [glossary-and-data-sources.md](glossary-and-data-sources.md) — most Home Affairs tools are JS-rendered with no public API, whereas ABS and data.gov.au expose machine-readable feeds.

## Maintenance

When updating: bump the "Last researched" line in the doc you touch, keep the Sources section current, and prefer primary `homeaffairs.gov.au` / `immi.homeaffairs.gov.au` / `legislation.gov.au` URLs over secondary commentary. The biggest annual refresh point is **1 July** (fees, thresholds, program year, many state programs).
