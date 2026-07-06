# Australian Skilled-Occupation Lists & Skills-Assessment Bodies — Developer Reference

> **Last researched: 2026-06-28. Verify figures against official sources before relying on them.**

This document is a developer reference for **AussieVisa Tracker**. It summarises the current
(FY2025–26) Australian skilled-occupation lists, the ANZSCO→OSCA classification transition, and
the skills-assessment authorities. Counts and dates change frequently via legislative instruments;
treat every number here as **indicative** and re-check the official source before shipping logic
that depends on it.

Australian English is used throughout.

---

## 1. Occupation Lists

### 1.1 The big change (December 2024)

On **3 December 2024** the Government published the **Core Skills Occupation List (CSOL)**, and on
**7 December 2024** the **Skills in Demand (SID) visa (subclass 482)** replaced the old Temporary
Skill Shortage (TSS) 482 visa. The CSOL **consolidated and replaced** the lists previously used for
**employer-sponsored** visas (the old 482/186 lists, including the STSOL as applied to those visas).

**Critical nuance for developers:** the CSOL change applies to the **employer-sponsored** stream
(SID 482 Core Skills, and ENS subclass 186). The **points-tested / state-nominated** visas
(**189, 190, 491**) still use the older trio — **MLTSSL, STSOL, ROL** — as of the research date.
There are *two parallel list regimes* right now. Do not assume one list governs all visas.

### 1.2 Current lists and visa mapping

| List | Approx. size | Primary visa subclasses | Status |
|------|-------------|------------------------|--------|
| **CSOL** — Core Skills Occupation List | ~456 occupations | **482** (SID Core Skills stream), **186** (ENS, Direct Entry & TRT) | Current; introduced Dec 2024 |
| **MLTSSL** — Medium and Long-term Strategic Skills List | ~212 occupations | **189** (Skilled Independent), **190**, **491**; also used for **485** Graduate eligibility checks | Current (points-tested regime) |
| **STSOL** — Short-term Skilled Occupation List | ~215 occupations | **190**, **491** (state/regional nominated only — *not* 189) | Current (points-tested regime) |
| **ROL** — Regional Occupation List | ~77 occupations | **491** (regional) | Current (points-tested regime) |

> ⚠️ **Counts are indicative.** Reported figures vary by source and by the date of the underlying
> legislative instrument (e.g. CSOL is commonly cited as ~456; MLTSSL ~212; STSOL ~215; ROL ~77).
> Always pull the live count from the official instrument / Home Affairs tool.

#### Notes on specific subclasses

- **Subclass 189 (Skilled Independent, points-tested):** occupation **must be on MLTSSL**. STSOL and
  ROL occupations are excluded.
- **Subclass 190 (State/Territory Nominated):** MLTSSL **or** STSOL, subject to the nominating
  state/territory's own selections.
- **Subclass 491 (Skilled Work Regional, points-tested):** MLTSSL, STSOL **or** ROL, subject to state
  or family-sponsorship pathway.
- **Subclass 482 (Skills in Demand):** Core Skills stream uses the **CSOL**. The SID visa also has a
  **Specialist Skills stream** (high-income threshold, occupation generally not restricted to a list —
  *verify exact exclusions*) and an **Essential Skills stream** (lower-paid, capped — *details
  evolving, verify*).
- **Subclass 186 (Employer Nomination Scheme):** uses the **CSOL** for Direct Entry and Temporary
  Residence Transition streams (the Dec 2024 change notably expanded the occupations with a direct PR
  pathway).
- **Subclass 494 (Skilled Employer Sponsored Regional):** ⚠️ **Unverified here** — historically used a
  regional occupation list; confirm whether it now references the CSOL or a separate regional
  instrument before coding.

### 1.3 State-specific lists concept

States and territories publish **their own nomination lists** for **190** and **491**, drawn from the
MLTSSL/STSOL (and, for the SID/employer stream, the CSOL). Each jurisdiction (NSW, VIC, QLD, SA, WA,
TAS, ACT, NT) sets its own eligible occupations, additional criteria (e.g. local job offer, residence,
sector priorities), and opening/closing dates. These are **not a single federal list** — AussieVisa
Tracker should model state lists as a per-jurisdiction, per-financial-year dataset that **overlays**
the federal lists. Source each from the relevant state migration website (e.g. NSW: nsw.gov.au;
VIC: liveinmelbourne.vic.gov.au; etc.).

### 1.4 How to check if an occupation is eligible

1. **Federal check (authoritative):** Home Affairs "Skilled occupation list" tool —
   <https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list>. Search by
   occupation title or **ANZSCO code**; the tool shows which list(s) the occupation is on, the
   eligible visa subclasses, and the **assessing authority**.
2. **Legislative source of truth:** the relevant **legislative instrument** on the Federal Register of
   Legislation (legislation.gov.au) — e.g. the *Migration (Specification of Occupations – Subclass 482
   Visa) Instrument 2024* for CSOL, and the *Migration (LIN 19/051: Specification of occupations …)*
   style instruments for MLTSSL/STSOL/ROL. Instruments are the legally binding list; the website tool
   reflects them.
3. **State check (for 190/491):** confirm the occupation is also on the **nominating state/territory's**
   current list and meets its extra criteria.
4. **Employer-sponsored (482/186):** confirm the occupation is on the **CSOL** and meets the
   stream-specific salary threshold.

---

## 2. Occupation Classification: ANZSCO vs OSCA

| | ANZSCO | OSCA |
|---|--------|------|
| Full name | Australian and New Zealand Standard Classification of Occupations | Occupation Standard Classification for Australia |
| Owner | ABS (jointly with Stats NZ, ended Oct 2024) | ABS (Australia-only) |
| Latest/release | ANZSCO 2022 / v1.3 lineage | **OSCA 2024 v1.0, released 6 December 2024** |
| Structure | 8 major groups; 6-digit occupation codes | **8 major groups; 6-digit occupation codes**; ~1,156 occupations (up from ANZSCO's ~1,076) |
| Status in migration | **Still the code system used by Home Affairs for skilled migration** (as of research date) | **Not yet adopted** by Home Affairs for visa/occupation-list purposes |

**OSCA hierarchy (5 levels):** Major group (1 digit) → Sub-major group (2 digits) → Minor group
(3 digits) → Unit group (4 digits) → Occupation (6 digits).

**Key takeaways for AussieVisa Tracker:**

- **Skilled migration currently runs on ANZSCO codes.** Build the occupation model on **ANZSCO** now.
- OSCA is the **future** classification. The ABS publishes **ANZSCO↔OSCA correspondence (mapping)
  files** under "Data downloads" on the ABS OSCA release page — ingest these so you can map between
  systems when Home Affairs eventually transitions.
- Design the schema to carry **both** an ANZSCO code and an (optional) OSCA code per occupation, plus a
  flag for which classification a given visa rule references. ⚠️ Re-verify Home Affairs' adoption
  status periodically — transition timing is not yet officially fixed.

---

## 3. Skills Assessment Authorities

A positive **skills assessment** from the occupation's **designated assessing authority** is required
for most skilled visas. The authority is determined by the occupation (see the Home Affairs occupation
tool, which lists the authority per ANZSCO code).

### 3.1 Validity period (general rule)

- Most assessments are valid **3 years** from date of issue, **unless the authority states otherwise**
  on the assessment letter.
- **ACS is the notable exception: 2 years (24 months).**
- The visa application generally must be **lodged before the assessment expires**.
- ⚠️ Validity is set per-authority and can change; always read the assessment letter and the
  authority's current policy.

### 3.2 Major assessing authorities

| Authority | Covers (occupation domain) | Official website | Typical validity |
|-----------|---------------------------|------------------|------------------|
| **VETASSESS** | Largest general-skills assessor — 350+ professional occupations (business, management, HR, marketing, science, arts, community services) **plus** many trade occupations | vetassess.com.au | 3 years |
| **ACS** (Australian Computer Society) | ICT / IT occupations (software & applications programmers, analysts, ICT business/systems analysts, network & database admins, etc.) | acs.org.au (msa) | **2 years (24 months)** |
| **Engineers Australia (EA)** | All engineering occupations (civil, mechanical, electrical, electronics, chemical, structural, mining, biomedical, environmental); overseas applicants typically via the **Competency Demonstration Report (CDR)** | engineersaustralia.org.au | 3 years |
| **TRA** (Trades Recognition Australia) | Trade occupations (electrician, plumber, carpenter, motor mechanic, chef/cook, welder, baker, etc.); govt body | tradesrecognitionaustralia.gov.au | 3 years |
| **CPA Australia** | Accounting & finance occupations | cpaaustralia.com.au | 3 years |
| **CA ANZ** (Chartered Accountants Australia and New Zealand; = **CAANZ**) | Accounting & finance occupations | charteredaccountantsanz.com | 3 years |
| **IPA** (Institute of Public Accountants) | Accounting & finance occupations | publicaccountants.org.au | 3 years |
| **ANMAC** (Australian Nursing and Midwifery Accreditation Council) | Registered nurses, enrolled nurses, midwives, nurse practitioners | anmac.org.au | 3 years (⚠️ one source cited 2 yrs — verify) |
| **AITSL** (Australian Institute for Teaching and School Leadership) | School teachers (early childhood, primary, secondary) | aitsl.edu.au | 3 years |
| **AASW** (Australian Association of Social Workers) | **Social Worker** (ANZSCO 272511) and related social-work occupations | aasw.asn.au | 3 years (verify) |
| **ACWA** (Australian Community Workers Association) | Welfare / community worker occupations | acwa.org.au | 3 years (verify) |
| **AHPRA** + National Boards (medical/health) | Registered health professions are largely handled via profession-specific accreditation councils + AHPRA registration; the *migration assessing authority* per occupation is usually the relevant profession council (see below), not AHPRA itself | ahpra.gov.au | n/a (registration body) |

### 3.3 Profession-specific health & specialist authorities (commonly referenced)

| Authority | Covers | Website (verify) |
|-----------|--------|------------------|
| **AMC** (Australian Medical Council) | Medical practitioners / doctors | amc.org.au |
| **ADC** (Australian Dental Council) | Dentists & dental occupations | adc.org.au |
| **APC** (Australian Pharmacy Council) | Pharmacists | pharmacycouncil.org.au |
| **Australian Physiotherapy Council** | Physiotherapists | physiocouncil.com.au |
| **OTC** (Occupational Therapy Council) | Occupational therapists | otcouncil.com.au |
| **SPA** (Speech Pathology Australia) | Speech pathologists | speechpathologyaustralia.org.au |
| **APS** (Australian Psychological Society) | Psychologists | psychology.org.au |
| **AVBC** (Australasian Veterinary Boards Council) | Veterinarians | avbc.asn.au |
| **OCANZ** (Optometry Council of Australia and New Zealand) | Optometrists | ocanz.org |
| **AACA** (Architects Accreditation Council of Australia) | Architects | aaca.org.au |
| **AIMS / ASMIRT / Dietitians Australia** etc. | Various allied-health occupations | (verify per occupation) |

> ⚠️ The health-profession authority list above is **partly inferred from common practice** and was
> not all confirmed against the Home Affairs page during this research (the official assessing-
> authorities page returned access errors to the fetch tool). **Treat website URLs as starting points
> and confirm the exact authority per ANZSCO code via the Home Affairs occupation tool before relying
> on them.**

### 3.4 Items flagged from the brief (corrections)

- **"ACWA (social work)"** — the social-work assessor is **AASW**. **ACWA** (Australian Community
  Workers Association) is a *separate* authority covering **welfare/community workers**. Both are real;
  the domains differ.
- **"AICD"** (Australian Institute of Company Directors) — **not a migration skills-assessing
  authority.** Likely confusion with **AIM** (Australian Institute of Management), which *does* assess
  some management occupations. Do not map AICD as an assessor.
- **"CAANZ"** and **"CA ANZ"** are the **same body** (Chartered Accountants Australia and New Zealand).
  De-duplicate in any data model.
- **AHPRA** is the national health *registration* agency; for migration, the per-occupation assessing
  authority is generally the relevant profession council, not AHPRA itself.

---

## 4. Implementation notes for AussieVisa Tracker

- Model **two list regimes**: employer-sponsored (CSOL) vs points-tested (MLTSSL/STSOL/ROL). A single
  occupation can appear on different lists with different visa eligibility.
- Key on **ANZSCO code** today; add an optional **OSCA code** column and ingest the ABS correspondence
  file for future-proofing.
- Store **assessing authority per occupation** (from the Home Affairs tool), and an authority-level
  **validity period** (default 3 years; ACS = 2 years).
- Treat **state/territory lists** as a separate per-jurisdiction, per-FY overlay dataset.
- Cache the **legislative instruments** (legislation.gov.au) as the binding source; the website tool is
  the convenient mirror.
- Re-validate all counts and the OSCA-adoption status at least each financial year (lists are typically
  refreshed around the **1 July** FY boundary and via ad-hoc instruments).

---

## 5. Sources

All accessed **2026-06-28** unless noted. Official/primary sources are listed first.

**Official / primary**

- Home Affairs — Skilled occupation list (tool):
  <https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list>
  *(Note: returned HTTP 403 to the automated fetch tool during this research; content corroborated via
  secondary sources. Verify directly in a browser.)*
- Home Affairs — Skills in Demand visa (subclass 482), Core Skills stream:
  <https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-visa-subclass-482/core-skills-stream>
  *(Returned HTTP 403 to fetch tool; verify in browser.)*
- Home Affairs — Assessing authorities:
  <https://immi.homeaffairs.gov.au/visas/working-in-australia/skills-assessment/assessing-authorities>
  *(Returned HTTP 403 to fetch tool; verify in browser.)*
- ABS — OSCA (Occupation Standard Classification for Australia), 2024 v1.0, latest release
  (released **6 December 2024**):
  <https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/latest-release>
- ABS — OSCA 2024 v1.0, Introduction:
  <https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/introduction>
- ABS — OSCA 2024 v1.0 (full export, structure detail — 8 major groups, 6-digit codes, ~1,156
  occupations): <https://www.abs.gov.au/book/export/41460/print>
- Federal Register of Legislation — *Migration (Specification of Occupations – Subclass 482 Visa)
  Instrument 2024* (CSOL legal instrument): search legislation.gov.au.
- AASW — Migration & eligibility assessment (Social Worker 272511):
  <https://www.aasw.asn.au/education-employment/migration-eligibility-assessment/>
- VETASSESS — Renewal of full skills assessment (validity guidance):
  <https://www.vetassess.com.au/skills-assessment-for-migration/professional-occupations/renewal-of-full-skills-assessment>
- ACS — Migration Skills Assessment, information for applicants:
  <https://www.acs.org.au/msa/information-for-applicants.html>

**Secondary (cross-checking only — not authoritative)**

- Migration Alliance — Subclass 482 Instrument 2024 summary:
  <https://migrationalliance.com.au/immigration-daily-news/entry/2024-12-migration-specification-of-occupations-subclass-482-visa-instrument-2024.html>
- Anzscosearch — Skilled occupation list / MLTSSL:
  <https://www.anzscosearch.com/skilled-occupation-list/> ,
  <https://www.anzscosearch.com/mltssl/>
- ABS overview / OSCA explainer (secondary):
  <https://www.migrationexpert.com.au/blog/occupation-standard-classification-for-australia-osca/>
- Openvisa — skills-assessment authorities, costs & validity (2026):
  <https://www.openvisa.org/blog/australia-skills-assessment-2026-which-organization-assesses-your-occupation-and-what-it-actually-costs>
- Syncskills — skills-assessment bodies guide (2026):
  <https://www.syncskills.com.au/resources/skills-assessment-bodies>
- thinkhigher — MLTSSL/STSOL/ROL/CSOL list explainer (2025-26):
  <https://thinkhigher.com.au/mltssl-stsol-rol-csol-understanding-occupation-lists/>

---

### Confidence & verification flags

- ✅ **High confidence:** CSOL introduced Dec 2024 for SID 482 / 186; MLTSSL/STSOL/ROL still used for
  189/190/491; OSCA 2024 v1.0 released 6 Dec 2024 with 8 major groups & 6-digit codes; OSCA not yet
  used in migration; ACS validity 2 years; general 3-year validity.
- ⚠️ **Verify before relying:** all occupation **counts**; exact **484/494** list behaviour; per-
  authority validity beyond ACS/EA/VETASSESS; the full health-profession authority list and their
  URLs; SID Specialist/Essential stream occupation rules. The official Home Affairs pages blocked
  automated fetching, so authority↔occupation mappings should be confirmed in a browser against the
  live Home Affairs occupation tool.
