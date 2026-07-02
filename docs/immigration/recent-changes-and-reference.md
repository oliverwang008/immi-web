# AussieVisa Tracker — Recent Australian Immigration Changes & Developer Reference

> **Last researched: 2026-06-28. Immigration policy changes frequently — verify against official sources before relying on them.**

This document is a developer-oriented reference summarising **recent** Australian immigration law and policy changes (from the December 2023 Migration Strategy through 2024, 2025 and into 2026), plus general reference knowledge useful for building "AussieVisa Tracker".

**Source caveat:** During research, several official pages on `immi.homeaffairs.gov.au` and `homeaffairs.gov.au` returned HTTP 403 to automated fetching. Where this happened, figures were taken from reputable migration-law firms, professional services firms (KPMG, BDO, Fragomen, MinterEllison) and education-sector bodies, and **cross-checked across multiple independent sources**. Items that could not be fully verified against a primary government source are explicitly flagged with ⚠️. Always confirm dollar figures, dates and lists against the official Department of Home Affairs website before relying on them in production.

---

## Timeline of key changes

| Date | Change | Notes |
|------|--------|-------|
| 11 Dec 2023 | **Migration Strategy** released | 8 key actions, 25+ policy commitments |
| 23 Mar 2024 | **Genuine Student (GS)** requirement replaces Genuine Temporary Entrant (GTE) for Student (500) visas | Targeted questions replace the 300-word statement |
| 24 Apr – 24 May 2024 | **Points Test review** discussion paper consultation | 204 in-scope submissions; not yet legislated as of mid-2026 ⚠️ |
| 1 Jul 2024 | **Significant Cost Threshold (SCT)** for health requirement raised from ~$51,000 to **$86,000** | Health requirement easing |
| 16 Oct 2024 | Australian-born-and-resident applicants exempted from parts of the health requirement | ⚠️ verify scope |
| 7 Dec 2024 | **Skills in Demand (SID) visa (subclass 482)** replaces Temporary Skill Shortage (TSS) 482 | New Core Skills Occupation List (CSOL); 3 streams |
| 7 Dec 2024 | **CSOL** consolidates MLTSSL / STSOL / ROL into one list (~456 occupations) | Used by SID Core Skills + ENS 186 Direct Entry |
| 1 Jul 2025 | **Student (500) / Student Guardian (590) VAC** raised from $1,600 to **$2,000** | Most other VACs indexed ~3% (CPI) |
| 1 Jul 2025 | Annual indexation of CSIT/SSIT | CSIT $76,515; SSIT $141,210 for FY2025–26 |
| 15 Sep 2025 | **2025–26 Migration Program** confirmed at 185,000 | Talent & Innovation category introduced (4,300) ⚠️ date |
| FY2026 | Student commencement cap set to **295,000** (+25,000) | Managed via Ministerial Direction allocations ⚠️ |
| 1 Jul 2026 | CSIT rises to **$79,499**; SSIT to **$146,717** | AWOTE-based indexation (Nov 2025 data) |
| 2026–27 | **Migration Program** held at 185,000; internal skilled reallocation | Employer-Sponsored up to ~58,040; Regional cut to ~14,110 |

---

## 1. The Migration Strategy (December 2023) and what has been implemented

The **Migration Strategy** was released on **11 December 2023**. It set out a new vision for Australia's migration system, with a policy roadmap of **8 key actions** and over 25 policy commitments / areas for future reform. Stated aim: return migration toward pre-pandemic levels and make the system "fit for purpose."

**The eight key actions:**
1. **Refining temporary skilled migration** — introduce a new Skills in Demand visa (4-year term, streamlined processing, mobility between approved employers, clearer PR pathways).
2. **Reshaping permanent skilled migration** — strengthen the economic impact of skilled migration; review the points test.
3. **Strengthening international education** — improve integrity and quality (Genuine Student requirement, English and financial settings, provider integrity).
4. **Tackling worker exploitation** — new legislation, powers, penalties.
5. **Planning migration for skills & population** — evidence-based, multi-year planning with states/territories.
6. **Tailoring regional visas and the Working Holiday Maker program.**
7–8. **System efficiency / other reform areas** (processing, data, and ongoing reform).

### What has actually been implemented since

- **Skills in Demand (SID) visa — IMPLEMENTED 7 Dec 2024.** Replaced the TSS subclass 482. (Detail in §1a below.)
- **Core Skills Occupation List (CSOL) — IMPLEMENTED 7 Dec 2024.** (Detail in §1b.)
- **Genuine Student requirement — IMPLEMENTED 23 Mar 2024.** (Detail in §6.)
- **Points-test review — CONSULTED (Apr–May 2024) but NOT YET fully legislated** as of mid-2026. (Detail in §1d.) ⚠️
- **Multi-year planning horizon — ADOPTED**, with the program shifting toward a four-year planning approach from 2025–26. (Detail in §3.)
- **Worker exploitation / employer compliance** — strengthened sponsorship obligations and mobility rules accompanied the SID launch.

### 1a. Skills in Demand (SID) visa — subclass 482

Launched **7 December 2024**, replacing the Temporary Skill Shortage (TSS) 482 visa. Key features:

- **Three streams:**
  - **Specialist Skills stream** — for highly skilled, high-earning workers; **no occupation-list requirement** (but excludes trades, machinery operators/drivers, and labourers); **no age limit noted**; designed for fast processing (median service standard ~7 days); ~3,000 places/year allocated. ⚠️ (allocation figure from secondary sources)
  - **Core Skills stream** — occupation must be on the **Core Skills Occupation List (CSOL)**; salary must meet the **Core Skills Income Threshold (CSIT)**.
  - **Labour Agreement stream** — for employers with a labour agreement.
- **4-year visa term.**
- **Work experience requirement reduced from 2 years to 1 year.**
- **Greater worker mobility** — time with any approved employer can count toward permanent residence; easier to change employers.
- **Pathway to PR** — improved pathways to permanent residence (e.g. via Employer Nomination Scheme subclass 186).

### 1b. Core Skills Occupation List (CSOL)

- Introduced alongside SID (released ~3–7 Dec 2024).
- **Consolidates** the former MLTSSL, STSOL and ROL into a **single list (~456 occupations)**. ⚠️ (count from secondary sources)
- Applies to the **SID Core Skills stream** and the **Employer Nomination Scheme (subclass 186) Direct Entry stream**.
- Over 70 new occupations reportedly added (e.g. Data Analyst, Supply Chain Analyst, Tour Guide, Child Care Worker), reflecting demand in aged care, regional education, agriculture and cyber security. ⚠️

### 1c. Changes to employer sponsorship

- Reduced work-experience requirement (1 year).
- Enhanced worker mobility and clearer PR pathways (above).
- Strengthened sponsor obligations / integrity measures as part of the worker-exploitation action.

### 1d. Points-test review

- Discussion paper released **24 April 2024**; consultation **24 Apr – 24 May 2024**; **204 in-scope submissions**.
- Current pass mark remains **65 points** for subclasses 189 / 190 / 491, though actual invitation cut-offs are much higher (often 85+ for in-demand occupations in 2024–25).
- Proposed directions (NOT yet legislated as of mid-2026 ⚠️): stronger age weighting toward younger applicants; higher English baseline (Proficient/IELTS 7); greater recognition of partner attributes; possible removal of Australian-study / Professional Year bonus points; income-based points; and a redesigned scale (reports of a 500-point scale with a 300-point pass mark). **Treat all specific proposed numbers as unconfirmed until legislated.**

### 1e. Workforce / labour market changes

- Labour Market Testing settings and the broader "planning migration for skills" action feed into occupation-list design (CSOL) and program planning. Specific Workforce Australia integration details could not be confirmed against a primary source. ⚠️

---

## 2. Salary thresholds for employer-sponsored visas

The old **Temporary Skilled Migration Income Threshold (TSMIT)** has been replaced under the SID framework by two thresholds, indexed annually under **regulation 5.42A** of the Migration Regulations using **Average Weekly Ordinary Time Earnings (AWOTE)** data from the ABS.

| Threshold | At SID launch (7 Dec 2024) | FY2025–26 (from 1 Jul 2025) | FY2026–27 (from 1 Jul 2026) |
|-----------|---------------------------|------------------------------|------------------------------|
| **Core Skills Income Threshold (CSIT)** | $73,150 | **$76,515** | **$79,499** |
| **Specialist Skills Income Threshold (SSIT)** | $135,000 | **$141,210** | **$146,717** |

**Indexation / transitional rules:**
- Thresholds are set each 1 July based on the most recent AWOTE release (the 1 Jul 2026 figures use Nov 2025 AWOTE data).
- Applications are assessed against the threshold **in force on the lodgement date** — applications lodged before 1 July are assessed under the prior-year threshold even if decided later.
- These thresholds apply to **subclass 482 (SID)** and **subclass 186 (ENS)** (and remain relevant to subclass 494 / employer-sponsored arrangements). ⚠️ confirm 494 treatment against official source.

---

## 3. Permanent Migration Program planning levels

The Permanent Migration Program is the **annual ceiling** for permanent visa grants, split across Skill, Family and Special Eligibility streams. From 2025–26 the government moved toward a **multi-year (four-year) planning horizon**.

| Program year | Total | Skill | Family | Special Eligibility |
|--------------|-------|-------|--------|---------------------|
| 2024–25 | 185,000 | 132,200 (~71%) | 52,500 (~28%) | 300 |
| 2025–26 | 185,000 | 132,200 (~71%) | 52,500 (~28%) | 300 |
| 2026–27 | 185,000 | 132,240 | 52,460 | 300 |

**Notable composition changes:**
- **2025–26:** introduced a **Talent and Innovation** category (~4,300 places) consolidating the former Global Talent and Distinguished Talent programs and the new National Innovation visa. ⚠️ (announcement date reported as 15 Sep 2025 by secondary source)
- **2026–27 internal reallocation within the Skill stream** (secondary sources ⚠️):
  - Employer-Sponsored: ~**58,040** (largest single skilled slice)
  - State/Territory Nominated: ~**35,500**
  - Skilled Independent (189): ~**21,090**
  - Regional: cut sharply to ~**14,110** (from ~33,000)
  - ~**129,590** places earmarked for migrants already onshore (supporting temporary-to-permanent transition).

---

## 4. Net Overseas Migration (NOM) trends & student/temporary-visa policy

**NOM (ABS):**
- **2023–24: ~429,000** (peak post-pandemic).
- **2024–25: ~306,000** (down ~29%). Migrant arrivals fell ~14% to ~568,000; the largest single arrival group was temporary students (~157,000).
- **2025–26 (Treasury forecast): ~260,000** — though some analysts expect this to be exceeded. ⚠️ forecast.

**Student / temporary-visa policy changes feeding NOM down:**
- Higher English-language and financial-capacity requirements for student visas.
- **Genuine Student** requirement (see §6).
- Restrictions on onshore "visa hopping" / applying for further student stays.
- Increased scrutiny of fraudulent/misleading applications.
- **Student (500) VAC: $710 → $1,600 → $2,000** (1 Jul 2025).
- **Student commencement caps / allocations:** managed via Ministerial Direction; cap reported at **295,000 (+25,000) for 2026**, with allocations tied to provider engagement and student accommodation. ⚠️ verify exact figure and mechanism.
- Student visa lodgements fell to ~427,000 in 2024–25 (from ~600,000 the prior year).

---

## 5. Bridging visas (A, B, C, E)

Bridging visas keep a non-citizen **lawful** in Australia between the expiry of a substantive visa and a decision (or departure). They do not grant PR. Always verify the conditions printed on the actual grant notice — work/study/travel rights vary case-by-case.

| Visa | When granted | Work rights | Travel | Typical use |
|------|--------------|-------------|--------|-------------|
| **BVA (010)** | Automatically when a valid onshore substantive visa application is made while holding a substantive visa | Generally **same conditions as the prior substantive visa**; often **unlimited** work where the onshore application is for a permanent/provisional visa | **No** re-entry (leave = it ceases) | Most common bridging visa; "springs into effect" when the old visa expires |
| **BVB (020)** | On application by a current BVA/BVB holder | Same as BVA | **Yes** — only bridging visa permitting travel & re-entry within a specified period | Travel during processing |
| **BVC (030)** | When an onshore application is lodged **without** holding a substantive visa at lodgement | **No work rights by default** — must apply, showing a "compelling need to work" / financial hardship | **No** | Applicants who were unlawful or whose substantive visa had lapsed |
| **BVE (050/051)** | Visa of last resort for unlawful non-citizens or those finalising other processes | **No work rights by default**; apply with evidence | **No** | Awaiting departure, AAT review, ministerial intervention, etc. |

**General notes:**
- A bridging visa with no work rights can sometimes have work rights added with evidence of financial hardship / compelling need.
- BVA/BVB conditions inherit from the substantive visa; if the prior visa had a "no work" or "8105" study limit, that typically carries over.
- ⚠️ Exact subclass codes, "three working days" lodgement windows, and condition codes should be verified on the Department's bridging visa pages.

---

## 6. Genuine Student, character (s501) and health requirements

### Genuine Temporary Entrant (GTE) → Genuine Student (GS)
- The **Genuine Student (GS)** requirement replaced the **GTE** requirement for **Student (subclass 500)** applications lodged **on or after 23 March 2024**.
- Applications lodged before that date are assessed under GTE; **Student Guardian (590)** applicants continue under GTE.
- GS replaces the 300-word statement with a set of **targeted questions**.
- Crucially, GS **no longer requires applicants to show they intend to stay only temporarily**, acknowledging legitimate post-study PR pathways. It is still used to filter out non-genuine students.

### Character requirement — s501 (Migration Act 1958)
- The **character test** under **s501** allows refusal/cancellation where a person fails the character test (e.g. **"substantial criminal record"** — generally a sentence of **12 months or more**, including aggregated sentences; association with criminal organisations; risk to the community).
- The Minister/delegate has discretion, including personal non-delegable powers and Ministerial Directions guiding decision-making (e.g. Direction on visa refusal/cancellation under s501). ⚠️ The current Ministerial Direction number/version should be confirmed against the official source as these are periodically reissued.

### Health requirement
- Applicants must generally meet **Public Interest Criteria** (e.g. PIC 4005/4007) — free from conditions that are a threat to public health or would be a **significant cost** to the community.
- **Significant Cost Threshold (SCT)** raised from **~$51,000 to $86,000 on 1 July 2024**.
- Temporary visas: costs assessed over the **period of stay**; permanent/provisional: generally over **5 years** (or **3 years** if aged 75+).
- From **16 October 2024**, certain applicants **born in and ordinarily resident in Australia** were exempted from parts of the health requirement. ⚠️ verify exact cohort/scope.
- A **health waiver** may be available for some visa subclasses (PIC 4007).

---

## 7. Other significant 2025–2026 legislative & fee changes

- **Visa Application Charge (VAC) indexation — 1 July 2025:** most VACs increased ~**3% (CPI)**, rounded to nearest $5, under the *Migration Amendment (Visa Application Charges) Regulations 2025*.
- **Student (500) & Student Guardian (590) VAC:** increased to **$2,000** (from $1,600) on **1 July 2025** — well above general indexation. Pacific Island and Timor-Leste student applicants are exempt from this increase.
- **Post-study (Temporary Graduate, subclass 485) application fee** reportedly **doubled** (per ICEF Monitor, early 2026). ⚠️ confirm exact figure/date against official source.
- **CSIT/SSIT indexation — 1 July 2026** (see §2).
- **Points-test reform** — flagged in budget materials but **not yet legislated** as of mid-2026 (see §1d). ⚠️

---

## Items flagged as not fully verified (⚠️)

These should be confirmed against a primary Department of Home Affairs / legislation source before being relied upon in product copy or logic:
- Exact CSOL occupation count (~456) and the specific list of newly added occupations.
- SID stream annual allocations (e.g. ~3,000 Specialist Skills places).
- Exact 2025–26 / 2026–27 sub-stream allocations within the Skill stream and the announcement dates.
- Student commencement cap mechanism and exact 295,000 figure.
- Scope of the 16 Oct 2024 health-requirement exemption for Australian-born residents.
- Current s501 Ministerial Direction version.
- Subclass 485 fee doubling specifics.
- Treatment of subclass 494 under the CSIT/SSIT framework.
- All proposed points-test numbers (500-point scale, 300 pass mark, etc.) — proposals only.

---

## Sources

Accessed **2026-06-28** unless otherwise noted. Official Department of Home Affairs / immi pages are listed first; several returned HTTP 403 to automated fetching and were corroborated via the secondary sources below.

**Official (government):**
- Migration Strategy — https://immi.homeaffairs.gov.au/what-we-do/migration-strategy
- Skills in Demand visa (subclass 482) Core Skills stream — https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-visa-subclass-482/core-skills-stream
- Permanent Migration Program planning levels — https://immi.homeaffairs.gov.au/what-we-do/migration-program-planning-levels
- Australia's 2024–25 permanent Migration Program — https://www.homeaffairs.gov.au/reports-and-publications/submissions-and-discussion-papers/australias-2024-25-permanent-migration-program
- Review of the points test (discussion paper) — https://www.homeaffairs.gov.au/reports-and-publications/submissions-and-discussion-papers/review-of-the-points-test-discussion-paper
- Genuine Student requirement — https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/genuine-student-requirement
- Review of the Migration Health Requirement / Significant Cost Threshold — https://www.homeaffairs.gov.au/reports-and-publications/submissions-and-discussion-papers/review-of-australias-visa-significant-cost-threshold
- Health requirement (Protecting health care and community services) — https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/health/protecting-health-care-and-community-services
- Fees and charges for visas — https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges
- Study Australia — New Genuine Student requirement — https://www.studyaustralia.gov.au/en/tools-and-resources/news/new-genuine-student-requirement
- Study Australia — Student visa application charge increase — https://www.studyaustralia.gov.au/en/tools-and-resources/news/student-visa-application-charge-increase
- ABS Overseas Migration (latest release) — https://www.abs.gov.au/statistics/people/population/overseas-migration/latest-release

**Secondary (professional services / legal / education, used for cross-checking):**
- KPMG — Migration Strategy with eight key actions — https://kpmg.com/xx/en/our-insights/gms-flash-alert/flash-alert-2023-240.html
- MinterEllison — Skills in Demand visa launch — https://www.minterellison.com/articles/delays-to-governments-new-skills-in-demand-visa
- Ethos Migration — SID / Core Skills list (Dec 2024) — https://ethosmigration.com.au/skills-in-demand-visa-core-skills-list-commencing-7-december-2024/
- One Planet Migration Law — Core Skills Occupation List — https://oneplanetmigrationlaw.com.au/immigration-blog/what-is-the-482-visa-occupation-list-understanding-the-new-core-skills-occupation-list-csol/
- BDO — New skilled visa salary thresholds from 1 July 2026 — https://www.bdo.com.au/en-au/insights/migration-services/updated-income-thresholds-for-skilled-visas-what-employers-need-to-know
- Agape Henry Crux — CSIT/SSIT indexation 1 July 2026 — https://www.ahclawyers.com/news-articles/26/02/27/annual-indexation-of-the-csit-and-ssit-effective-1-july-2026
- Erickson Immigration Group — indexed salary thresholds July 2026 — https://eiglaw.com/australia-announces-indexed-increases-to-salary-thresholds-for-subclass-482-and-186-visas-effective-july-2026/
- Fragomen — 2025–26 Migration Program planning levels — https://www.fragomen.com/insights/australia-migration-program-planning-levels-202526-announced.html
- Ethos Migration — 2026–27 planning levels — https://ethosmigration.com.au/australias-migration-program-planning-levels-explained-2026-27/
- Work Visa Lawyers — 2026–27 planning levels — https://www.workvisalawyers.com.au/news/all/australia-s-2026-27-permanent-migration-program-planning-levels-understanding-the-australian-visa-numbers-and-permanent-residency.html
- SBS News — 2026 migration shift (students → skilled) — https://www.sbs.com.au/news/article/from-international-students-to-skilled-visas-inside-australias-2026-migration-shift/clyg421gp
- KPMG — Federal Budget 2025–26 immigration measures — https://kpmg.com/xx/en/our-insights/gms-flash-alert/flash-alert-2025-061.html
- ICEF Monitor — AUD$2,000 study visa fee impact / 485 fee doubling — https://monitor.icef.com/2026/02/australia-full-year-data-for-2025-reveals-impact-of-aud2000-study-visa-application-fee-on-elicos-sector/
- Aussizz Group — Bridging Visa Australia explained (2026) — https://www.aussizzgroup.com/blog/bridging-visa-australia-explained/
- Hannan Tew — Work rights on BVC/BVE — https://www.hannantew.com.au/bridging-visa/what-are-my-work-rights-on-a-bridging-visa-c-or-e/
- Roam Migration Law — GTE replaced with GS — https://www.roammigrationlaw.com/gte-requirement-replaced-with-gs/
- One Planet Migration Law — Significant Cost Threshold — https://oneplanetmigrationlaw.com.au/immigration-blog/understanding-the-significant-cost-threshold-in-visa-health-requirements/
- Lexology — Review of the skilled points test — https://www.lexology.com/library/detail.aspx?g=325bd994-2f65-4abe-929e-70c4e1ad2c93
