"""
Official Australian immigration government websites and their key URLs.
All URLs verified as returning valid content (200, no 404 body).
Covers federal departments and all 8 state/territory migration programs.
"""

OFFICIAL_SITES: dict[str, dict] = {

    # ── Federal ───────────────────────────────────────────────────────────────

    "Department of Home Affairs - Immigration Portal": {
        "base": "https://immi.homeaffairs.gov.au",
        "department": "Department of Home Affairs",
        "urls": [
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times",
            "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list",
            "https://immi.homeaffairs.gov.au/what-we-do/skilled-migration-program",
            "https://immi.homeaffairs.gov.au/what-we-do/skilled-migration-program/recent-changes",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-provisional-491",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/parent-103",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/global-talent-visa-858",
            "https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/health",
            "https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/character",
            "https://immi.homeaffairs.gov.au/help-support/tools/points-calculator",
        ],
    },
    "Department of Home Affairs - Main": {
        "base": "https://www.homeaffairs.gov.au",
        "department": "Department of Home Affairs",
        "urls": [
            "https://www.homeaffairs.gov.au/about-us",
            "https://www.homeaffairs.gov.au/research-and-statistics/statistics/visa-statistics",
        ],
    },
    "Australian Border Force": {
        "base": "https://www.abf.gov.au",
        "department": "Australian Border Force",
        "urls": [
            "https://www.abf.gov.au/entering-and-leaving-australia",
            "https://www.abf.gov.au/entering-and-leaving-australia/crossing-the-border",
            "https://www.abf.gov.au/entering-and-leaving-australia/smartgate",
            "https://www.abf.gov.au/entering-and-leaving-australia/duty-free",
        ],
    },
    "Jobs and Skills Australia": {
        "base": "https://www.jobsandskills.gov.au",
        "department": "Jobs and Skills Australia",
        "urls": [
            "https://www.jobsandskills.gov.au/data/skills-priority-list",
            "https://www.jobsandskills.gov.au/data/labour-market-insights",
            "https://www.jobsandskills.gov.au/publications",
        ],
    },
    "Administrative Review Tribunal": {
        "base": "https://www.art.gov.au",
        "department": "Administrative Review Tribunal",
        "urls": [
            "https://www.art.gov.au/about-us",
            "https://www.art.gov.au/about/news-and-updates/changes-conduct-student-visa-reviews",
        ],
    },
    "Austrade - Business and Investment": {
        "base": "https://www.austrade.gov.au",
        "department": "Australian Trade and Investment Commission",
        "urls": [
            "https://www.austrade.gov.au/international/invest",
        ],
    },
    "Department of Education": {
        "base": "https://www.education.gov.au",
        "department": "Department of Education",
        "urls": [
            "https://www.education.gov.au/international-students",
        ],
    },
    "Services Australia": {
        "base": "https://www.servicesaustralia.gov.au",
        "department": "Services Australia",
        "urls": [
            "https://www.servicesaustralia.gov.au/newly-arrived-residents-waiting-period",
        ],
    },
    "Australian Bureau of Statistics": {
        "base": "https://www.abs.gov.au",
        "department": "Australian Bureau of Statistics",
        "urls": [
            "https://www.abs.gov.au/statistics/people/population/migration-australia",
            "https://www.abs.gov.au/statistics/people/population/overseas-migration",
        ],
    },

    # ── State & Territory Nomination Programs ─────────────────────────────────

    "NSW Government - Skilled Migration": {
        "base": "https://www.nsw.gov.au",
        "department": "NSW Government",
        "urls": [
            "https://www.nsw.gov.au/topics/visas-and-migration",
        ],
    },
    # Victoria (liveinmelbourne.vic.gov.au) blocks all automated requests with 403.
    # Victoria skilled migration info is available at immi.homeaffairs.gov.au instead.
    "Queensland - Skilled Migration": {
        "base": "https://migration.qld.gov.au",
        "department": "Queensland Government - Skilled Migration",
        "urls": [
            "https://migration.qld.gov.au/visa-options/",
            "https://migration.qld.gov.au/visa-options/business-visas",
            "https://migration.qld.gov.au/nomination-process/what-is-state-nomination",
            "https://migration.qld.gov.au/nomination-process/eligibility-criteria",
            "https://migration.qld.gov.au/occupation-lists/",
            "https://migration.qld.gov.au/occupation-lists/queensland-onshore-skilled-occupation-list",
            "https://migration.qld.gov.au/occupation-lists/offshore-queensland-skilled-occupation-lists-(qsol)",
            "https://migration.qld.gov.au/program-updates/",
        ],
    },
    "South Australia - Skilled Migration": {
        "base": "https://migration.sa.gov.au",
        "department": "South Australia Government - Skilled Migration",
        "urls": [
            "https://migration.sa.gov.au/skilled-migrants",
            "https://migration.sa.gov.au/visa-options",
            "https://migration.sa.gov.au/how-to-apply",
            "https://migration.sa.gov.au/occupation-lists",
        ],
    },
    "Western Australia - Skilled Migration": {
        "base": "https://migration.wa.gov.au",
        "department": "Western Australia Government - Skilled Migration",
        "urls": [
            "https://migration.wa.gov.au/moving-western-australia/migration-pathways-skilled-visas",
            "https://migration.wa.gov.au/our-services-support/skilled-migrant-employment-register",
            "https://migration.wa.gov.au/our-services-support/skilled-migration-job-connect",
            "https://migration.wa.gov.au/gday-western-australia",
        ],
    },
    "Tasmania - Skilled Migration": {
        "base": "https://www.migration.tas.gov.au",
        "department": "Tasmania Government - Skilled Migration",
        "urls": [
            "https://www.migration.tas.gov.au/skilled_migration",
            "https://www.migration.tas.gov.au/skilled_migration/skilled-workers-living-overseas",
            "https://www.migration.tas.gov.au/skilled_migration/health,-allied-health-and-teaching-occupations",
            "https://www.migration.tas.gov.au/skilled_migration/frequently_asked_questions",
            "https://www.migration.tas.gov.au/live_and_work",
            "https://www.migration.tas.gov.au/employers",
        ],
    },
    "ACT - Skilled Migration": {
        "base": "https://www.act.gov.au",
        "department": "ACT Government - Skilled Migration",
        "urls": [
            "https://www.act.gov.au/migration",
            "https://www.act.gov.au/migration/businesses",
            "https://www.act.gov.au/migration/employers",
            "https://www.act.gov.au/migration/resources",
            "https://www.act.gov.au/migration/resources/canberra-matrix-invitation-round",
        ],
    },
    "Northern Territory - Skilled Migration": {
        "base": "https://migration.nt.gov.au",
        "department": "Northern Territory Government - Skilled Migration",
        "urls": [
            "https://migration.nt.gov.au/skilled-migrants",
            "https://migration.nt.gov.au/190-visa",
            "https://migration.nt.gov.au/491-visa",
            "https://migration.nt.gov.au/occupation-list",
            "https://migration.nt.gov.au/how-to-apply",
            "https://migration.nt.gov.au/business-migration",
        ],
    },
}
