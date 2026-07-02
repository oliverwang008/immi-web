Last compiled: 2026-06-29.

# AussieVisa Tracker — Glossary & Official Data Sources

A developer reference for the AussieVisa Tracker app (Australian skilled-migration processing-time & EOI tracker, plus AI immigration consultant). Written in Australian English.

> **Currency note.** Australian skilled migration changed substantially in December 2024: the **Skills in Demand (SID)** visa replaced the **TSS (subclass 482)** visa (7 Dec 2024), the **Core Skills Occupation List (CSOL)** replaced the combined MLTSSL/STSOL for employer-sponsored pathways (7 Dec 2024), and the ABS released **OSCA** to replace **ANZSCO** (6 Dec 2024). Income thresholds index on 1 July each year — re-verify dollar figures against the official sources below before shipping.
>
> **Verification caveat.** Several official pages (e.g. `immi.homeaffairs.gov.au` tools and `data.gov.au` search) are JavaScript-rendered or return **HTTP 403** to automated fetching. Figures below were confirmed via ABS releases and secondary migration-law commentary where the primary page could not be machine-read; items that could not be directly verified are flagged. Always confirm against the live page before relying on a value.

---

## Part A — Glossary of terms & acronyms

| Term | Expansion | Definition |
|------|-----------|------------|
| **ABS** | Australian Bureau of Statistics | National statistical agency; publishes population, migration (NOM), and the OSCA occupation classification. |
| **AMSL** | (Annual Market Salary Limit / Level) | Not a current standard departmental term — most likely a variant reference to the AMSR (below). **Flagged: could not verify "AMSL" as an official acronym.** Treat as a synonym/typo for AMSR unless a primary source confirms otherwise. |
| **AMSR** | Annual Market Salary Rate | The salary an equivalent Australian worker would earn for the same role in the same location; sponsors must pay nominees at least the AMSR (and meet the relevant income threshold). Rules for calculating it were made more flexible from 25 March 2026. |
| **ANZSCO** | Australian and New Zealand Standard Classification of Occupations | Legacy occupation coding system (6-digit codes), used since 2006. Being phased out in favour of OSCA, but still embedded in several visa instruments and the CSOL (which maps to 2022 ANZSCO). |
| **BVA / BVB / BVC / BVE** | Bridging visa A / B / C / E | Temporary visas keeping a person lawful while a substantive visa or review is decided. **BVA (010)**: stay onshore while awaiting a decision. **BVB (020)**: as BVA but allows travel out and back. **BVC (030)**: for applicants who were unlawful/held no substantive visa when applying. **BVE (050/051)**: for unlawful non-citizens to remain lawful while arranging departure or resolving status. |
| **CCL** | Credentialled Community Language | NAATI test awarding points for community-language credentials in the points test (5 points). |
| **CSIT** | Core Skills Income Threshold | Minimum guaranteed annual earnings for the SID Core Skills stream (and a reference threshold for ENS/186). **AUD 76,515** for nominations lodged 1 Jul 2025 – 30 Jun 2026; indexed 1 July. |
| **CSOL** | Core Skills Occupation List | The occupation list (≈456 occupations) underpinning the SID Core Skills stream and ENS (186) Direct Entry, in force from 7 Dec 2024; replaced the combined MLTSSL/STSOL for those pathways. |
| **CSIT/SSIT/ESIT streams** | — | See SID below — the three SID streams are Core Skills, Specialist Skills, and (from 2026) Essential Skills (formerly Labour Agreement). |
| **DAMA** | Designated Area Migration Agreement | Region-specific labour agreements letting designated areas access occupations and concessions beyond standard lists, addressing local shortages. |
| **ENS** | Employer Nomination Scheme (subclass 186) | Permanent employer-sponsored visa; Direct Entry stream uses the CSOL. |
| **EOI** | Expression of Interest | A non-binding submission in SkillSelect indicating interest in a skilled visa; ranked against others and selected in invitation rounds. |
| **ESIT** | Essential Skills Income Threshold | Threshold/stream for the SID Essential Skills stream (rebrand of the Labour Agreement stream, phased in 2026) for lower-paid, regional or hard-to-fill roles. **Flagged: detailed settings still being finalised — verify before use.** |
| **Genuine Student (GS)** | Genuine Student requirement | Replaced the GTE requirement for student visas (from 23 Mar 2024); applicant must show they are a genuine student. |
| **GSM** | General Skilled Migration | Umbrella for points-tested skilled visas not requiring employer sponsorship: subclass 189 (Independent), 190 (State Nominated), 491 (Regional). |
| **GTE** | Genuine Temporary Entrant | Former student/temporary-visa requirement to show genuine temporary intent; largely superseded by the Genuine Student test for students. |
| **IMMI instrument** | — | A legislative instrument made under the Migration Act/Regulations, cited as "IMMI [year]/[number]" (e.g. specifying occupations, fees, or English requirements). Now generally registered with a **LIN** number. |
| **LIN instrument** | Legislative Instrument (Immigration) | The current numbering for migration legislative instruments, cited as "LIN [yy]/[nnn]"; defines occupation lists, thresholds, conditions, etc. |
| **MARA / OMARA** | (Office of the) Migration Agents Registration Authority | The statutory regulator of registered migration agents. (Note: regulation transitioned toward the Legal Services framework, but OMARA remains the registration body for non-lawyer agents.) |
| **MARN** | Migration Agents Registration Number | Unique number identifying a registered migration agent. |
| **MLTSSL** | Medium and Long-term Strategic Skills List | Occupation list for longer-term/PR pathways; still the gatekeeper for independent skilled migration (subclass 189) and several GSM visas. |
| **NAATI** | National Accreditation Authority for Translators and Interpreters | Body certifying translators/interpreters; administers the CCL test used for points. |
| **NOM** | Net Overseas Migration | Net gain/loss to the population from people arriving vs leaving over a 12-month period (based on a 12/16-month residency rule); a key driver of population planning, published by the ABS. |
| **OMARA** | Office of the Migration Agents Registration Authority | See MARA. |
| **OSCA** | Occupation Standard Classification for Australia | ABS occupation classification released 6 Dec 2024 (OSCA 2024 v1.0), replacing ANZSCO; adds ~300 occupations, retires ~250. Next update OSCA 2027 (March 2027). |
| **Planning levels** | Migration Program planning levels | Government-set annual caps/targets for permanent migration places (Skill, Family, Special Eligibility streams), set in the Federal Budget. |
| **PR** | Permanent Residence/Resident | Status allowing indefinite stay, work and study; a step toward citizenship. |
| **PY** | Professional Year | A 12-month structured professional development program (accounting, IT, engineering) worth 5 points in the points test. |
| **ROI** | Registration of Interest | A pre-EOI registration used by some state/territory nomination programs (and the National Innovation visa) to express interest before being invited to apply/lodge an EOI. |
| **ROL** | Regional Occupation List | Legacy list of occupations eligible only for regional visa pathways; superseded in part by CSOL/regional arrangements but still referenced in some instruments. |
| **RSMS** | Regional Sponsored Migration Scheme (subclass 187) | Former permanent regional employer-sponsored visa (now closed to most new applicants; largely replaced by subclass 494/186). |
| **s48** | Section 48, Migration Act 1958 | Bar preventing certain onshore applicants whose visa was refused/cancelled from lodging most further visa applications while in Australia. |
| **s501** | Section 501, Migration Act 1958 | The "character test"; allows refusal/cancellation of a visa on character grounds (e.g. substantial criminal record). |
| **SID** | Skills in Demand visa (subclass 482) | Replaced TSS on 7 Dec 2024. Three streams: **Specialist Skills** (SSIT, high earners), **Core Skills** (CSIT, occupations on the CSOL), and **Essential Skills** (formerly Labour Agreement). |
| **SkillSelect** | — | The Australian Government's online system for lodging EOIs and managing skilled-visa invitation rounds. |
| **SSIT** | Specialist Skills Income Threshold | Minimum earnings for the SID Specialist Skills stream: **AUD 141,210** (to 30 Jun 2026), rising to **AUD 146,717** from 1 Jul 2026 (per migration-law commentary — verify against Home Affairs). |
| **STSOL** | Short-term Skilled Occupation List | Legacy list for shorter-term occupations; replaced by CSOL for the SID/employer-sponsored pathways. |
| **TRT** | Temporary Residence Transition | A stream of ENS (186) letting eligible temporary work-visa holders transition to PR with their sponsoring employer. |
| **TSMIT** | Temporary Skilled Migration Income Threshold | The legacy minimum salary floor for sponsored work visas; under SID superseded by the CSIT. Scheduled to be **AUD 79,499** from 1 Jul 2026 where still referenced (verify). |
| **TSS** | Temporary Skill Shortage visa (former subclass 482) | The employer-sponsored temporary work visa replaced by the SID visa on 7 Dec 2024. |
| **Condition 8503** | No Further Stay | Prevents the holder from being granted most further visas onshore (Protection visa excepted) unless a waiver is granted on compelling, compassionate grounds beyond their control. |
| **Condition 8607** | Work condition (SID 482) | Mandatory work condition on primary SID visa holders: work only in the nominated occupation for the sponsoring employer (or associated entity). |
| **Condition 8608** | Notification/work-change condition (SID 482) | Governs job/employer changes and the obligation to notify Home Affairs of changes in work status within set timeframes. |

### Other commonly encountered terms
- **Subclass 189 / 190 / 491 / 494**: the core GSM visas — 189 Skilled Independent (points, no sponsor), 190 Skilled Nominated (state/territory), 491 Skilled Work Regional (provisional, points-tested), 494 Skilled Employer Sponsored Regional.
- **Points test**: scoring system for GSM visas (age, English, experience, qualifications, PY, CCL, partner skills, etc.); current floor to submit an EOI is **65 points**, but invitation cut-offs are usually much higher and vary by occupation.
- **Occupation ceiling**: per-occupation cap on invitations issued in a program year for subclass 189 and 491 (Family Sponsored); does not apply to 190 or state-nominated 491.
- **DHA / Home Affairs**: Department of Home Affairs — the administering department.
- **VEVO**: Visa Entitlement Verification Online — checks current visa status and conditions.

---

## Part B — Official data sources & tools (developer catalogue)

| Source | URL | Contents | Update cadence | Machine-readable? / Scraping difficulty |
|--------|-----|----------|----------------|------------------------------------------|
| **Global visa processing times tool** | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times | Indicative time to finalise **75%** and **90%** of recently decided applications, per subclass/stream. | **Monthly.** | Interactive **JavaScript** page; no published CSV/API. **Hard to scrape** — values load client-side. Consider headless-browser rendering or manual capture. |
| **Visa processing times — quarterly report** | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/quarterly-report | Broader quarterly performance reporting on processing. | **Quarterly.** | Web/HTML (some PDF). Semi-structured; moderate scraping effort. |
| **SkillSelect invitation round results ("Previous rounds")** | https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect/previous-rounds | Per-round results: invitations issued by subclass (189, 491 Family), minimum points, and lowest-ranked cut-off dates. | **Per round** — moved to a roughly **quarterly** schedule for 2025–26 (e.g. rounds Aug & Nov 2025). | HTML tables; **moderate** scraping (parse tables). No official API. |
| **Occupation ceilings** | Published within SkillSelect pages (see https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect) | Annual per-occupation invitation caps for 189 and 491 (Family Sponsored). | **Annually** (per program year). | HTML table (sometimes PDF). Moderate scraping. |
| **SkillSelect EOI Data dashboard** | https://api.dynamic.reports.employment.gov.au/anonap/extensions/hSKLS02_SkillSelect_EOI_Data/hSKLS02_SkillSelect_EOI_Data.html | Interactive dashboard of EOIs by subclass, occupation, points, nominating state (statuses: Submitted/Closed/Hold), as at month-end. | **Monthly** (data as at last day of month). | **Interactive dashboard** (Qlik-style; max 2 filters at a time). **No public API/CSV**; bulk/custom data requests via the Department's Data Channel incur a fee. **Hard to scrape.** |
| **Current visa pricing table** | https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges/current-visa-pricing | Base application charges and additional applicant charges by subclass. | On change — typically **annually on 1 July** (fees rose ~3% on 1 Jul 2025; Student 500 rose more). | HTML tables; **moderate** scraping. No official API/CSV. |
| **Visa pricing estimator** | https://immi.homeaffairs.gov.au/visas/visa-pricing-estimator | Interactive estimate of total charges based on subclass/applicant answers (also addressable via `?visa=<subclass>`). | Reflects current pricing (see above). | Interactive **JavaScript** tool. **Hard to scrape** — prefer the pricing table for raw figures. |
| **Fees and charges (landing)** | https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges | Overview, second-instalment (VAC2), surcharges, payment methods. | As above. | HTML. |
| **Skilled occupation list search** | https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list | Searchable lists (CSOL, MLTSSL, STSOL, ROL) showing which occupations apply to which visas, with ANZSCO/OSCA codes. | On policy change (lists revised periodically; major change Dec 2024). | Interactive search **plus** a downloadable CSOL **PDF** (e.g. https://immi.homeaffairs.gov.au/Documents/core-sol.pdf). PDF is parseable; search UI is JS. **Moderate.** |
| **ABS — Overseas Migration (NOM)** | https://www.abs.gov.au/statistics/people/population/overseas-migration/latest-release | Official NOM estimates, arrivals/departures, visa-group breakdowns. | **Annually** (financial-year reference, e.g. 2024–25). | ABS releases offer **downloadable data cubes (XLSX)** and an **ABS Data API (SDMX)** for many series. **Good machine-readability.** |
| **ABS — National, state and territory population** | https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release | Quarterly population incl. **net overseas migration** and natural increase by state/territory. | **Quarterly** (~6-month lag; e.g. Dec 2025 release). | XLSX data cubes + ABS Data API. **Good.** (Legacy catalogue ref: 3101.0.) |
| **ABS — Overseas Arrivals and Departures (OAD)** | https://www.abs.gov.au/statistics/industry/tourism-and-transport/overseas-arrivals-and-departures-australia/latest-release | Monthly arrivals/departures by visa category — a leading indicator for NOM. | **Monthly.** | XLSX + ABS Data API. **Good.** |
| **ABS — OSCA classification** | https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/latest-release | Occupation classification structure, codes, titles, tasks; ANZSCO↔OSCA correspondences. | Major versions (OSCA 2024 v1.0; OSCA 2027 due Mar 2027). | **Downloadable structures (XLSX/CSV)** and correspondence files. **Good.** |
| **Home Affairs — Net Overseas Migration statistics** | https://www.homeaffairs.gov.au/research-and-statistics/statistics/visa-statistics/live/net-overseas-migration | Departmental NOM commentary/visa statistics (complements ABS). | Periodic. | HTML + some downloads. Moderate. |
| **data.gov.au** | https://data.gov.au/search?q=skillselect (and `?q=migration` / `?q=visa`) | Open-data portal; hosts assorted Home Affairs/ABS visa & migration datasets (e.g. visa statistics, country-of-citizenship breakdowns) as CSV/XLSX, with a **CKAN API**. | Varies per dataset. | **CKAN API** (`/api/3/...`) returns JSON; many resources are CSV. **Good where datasets exist** — but the search UI returned **HTTP 403** to automated fetching in testing (**flagged**; query the CKAN API directly instead). |

### Notes for developers
- **JS-rendered / 403 pages.** The processing-times tool, the visa pricing estimator, the SkillSelect EOI dashboard, and the `data.gov.au` search UI either render client-side or block plain HTTP fetching. For these, prefer (a) an official downloadable artefact (PDF/XLSX), (b) the ABS Data API / data.gov.au CKAN API, or (c) a headless browser. Build a verification step that flags when a value cannot be confirmed against a primary source.
- **Best machine-readable sources** are the **ABS** releases (XLSX data cubes + SDMX Data API) and **data.gov.au CKAN API**. Home Affairs' own `immi.homeaffairs.gov.au` tools generally have **no public API** — plan for HTML parsing or PDF extraction, and cache aggressively.
- **Cadence cheat-sheet:** processing times = monthly; SkillSelect rounds = ~quarterly (2025–26); EOI dashboard = monthly; visa fees = annually (1 July); ABS NOM = annually; ABS population/NOM = quarterly; ABS OAD = monthly.
- **Income thresholds index on 1 July.** Cache the effective-dated value, not a hard-coded number, and re-check each July (CSIT, SSIT, TSMIT).
- **OSCA vs ANZSCO.** The CSOL currently maps to **2022 ANZSCO** codes even though OSCA is the new ABS standard; maintain an ANZSCO↔OSCA correspondence table (available from the ABS OSCA release) so the app can reconcile both.

---

## Sources

All URLs accessed **2026-06-29** unless noted. Primary/official sources are listed first.

**Official (immi.homeaffairs.gov.au / homeaffairs.gov.au / abs.gov.au / employment.gov.au)**
- Global visa processing times — https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times
- Visa processing times (landing) — https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times
- Visa processing times — quarterly report — https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/quarterly-report
- SkillSelect (landing) — https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect
- SkillSelect — Previous rounds — https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect/previous-rounds
- Skilled occupation list — https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list
- Core Skills Occupation List (PDF) — https://immi.homeaffairs.gov.au/Documents/core-sol.pdf
- Skills in Demand visa (subclass 482) — https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-visa-subclass-482
- SID — Core Skills stream — https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-visa-subclass-482/core-skills-stream
- Fees and charges — https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges
- Current visa pricing — https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges/current-visa-pricing
- Visa pricing estimator — https://immi.homeaffairs.gov.au/visas/visa-pricing-estimator
- Home Affairs — Net overseas migration statistics — https://www.homeaffairs.gov.au/research-and-statistics/statistics/visa-statistics/live/net-overseas-migration
- SkillSelect EOI Data dashboard (employment.gov.au) — https://api.dynamic.reports.employment.gov.au/anonap/extensions/hSKLS02_SkillSelect_EOI_Data/hSKLS02_SkillSelect_EOI_Data.html
- ABS — OSCA latest release — https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/latest-release
- ABS — OSCA 2024 v1.0 — https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/osca-2024-v10
- ABS — Overseas Migration, 2024-25 — https://www.abs.gov.au/statistics/people/population/overseas-migration/latest-release
- ABS — National, state and territory population — https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release
- ABS — Overseas Arrivals and Departures — https://www.abs.gov.au/statistics/industry/tourism-and-transport/overseas-arrivals-and-departures-australia/latest-release
- data.gov.au (search returned HTTP 403 to automated fetch; use CKAN API) — https://data.gov.au/search?q=skillselect

**Secondary (migration-law / commentary — used to confirm dates & figures where primary pages were JS-rendered or 403)**
- ANZSCO→OSCA change — https://www.ahclawyers.com/news-articles/2024/10/14/anzsco-to-be-replaced-by-osca-in-december-2024
- CSOL overview — https://www.ahclawyers.com/news-articles/2025/01/07/core-skills-occupation-list-csol-what-occupations-are-new-or-removed
- SID streams & thresholds — https://pathwaymigration.com/skills-in-demand-subclass-482-2025-streams-thresholds-pr/
- TSMIT/CSIT/SSIT 2026 indexation — https://tia.com.au/news/tsmit-salary-thresholds-and-confirmed-increases-for-july-2026/
- AMSR explanation & 2026 flexibility — https://www.ahclawyers.com/news-articles/26/03/24/annual-market-salary-rate-amsr-became-flexible-to-calculate-for-sponsored-work-visa-nomination
- Conditions 8607/8608 — https://www.ahclawyers.com/news-articles/25/02/03/what-are-visa-conditions-8107-8607-and-8608-on-work-visas
- Condition 8503 (No Further Stay) — https://www.hannantew.com.au/immigration/navigating-visa-condition-8503-no-further-stay/
- SkillSelect rounds 2025–26 — https://www.racc.net.au/skillselect-invitation-rounds

### Items flagged as unverified / needing confirmation
- **"AMSL"** — not found as a current official acronym; treated as a likely variant of **AMSR**. Confirm against a Home Affairs instrument if it appears in your data.
- **Exact 1 July 2026 dollar figures** (CSIT, SSIT, TSMIT) — sourced from migration-law commentary, not yet confirmed on a machine-readable Home Affairs page at compile time.
- **ESIT (Essential Skills) settings** — stream still being phased in during 2026; details subject to change.
- **data.gov.au dataset inventory** — could not be enumerated (search UI returned HTTP 403); query the CKAN API (`https://data.gov.au/api/3/action/package_search?q=...`) to confirm current visa/migration datasets.
