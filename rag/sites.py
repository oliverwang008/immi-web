"""
Official Australian immigration government websites and their key URLs.
Covers both federal and all 8 state/territory migration programs.
"""

OFFICIAL_SITES: dict[str, dict] = {
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
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-491",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-820-801",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-309-100",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/parent-103",
            "https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/health",
            "https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/character",
            "https://immi.homeaffairs.gov.au/points-calculator",
            "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/global-talent-858",
        ],
    },
    "Department of Home Affairs - Main": {
        "base": "https://www.homeaffairs.gov.au",
        "department": "Department of Home Affairs",
        "urls": [
            "https://www.homeaffairs.gov.au/about-us/our-portfolios/immigration",
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
            "https://www.abf.gov.au/entering-and-leaving-australia/can-i-bring-it-in",
        ],
    },
    "Jobs and Skills Australia": {
        "base": "https://www.jobsandskills.gov.au",
        "department": "Jobs and Skills Australia",
        "urls": [
            "https://www.jobsandskills.gov.au/data/skills-priority-list",
            "https://www.jobsandskills.gov.au/data/core-skills-occupation-list",
            "https://www.jobsandskills.gov.au/data/specialist-skills-occupation-list",
            "https://www.jobsandskills.gov.au/data/labour-market-insights",
        ],
    },
    "Administrative Review Tribunal": {
        "base": "https://www.art.gov.au",
        "department": "Administrative Review Tribunal",
        "urls": [
            "https://www.art.gov.au/applications-and-hearings/visa-and-citizenship-decisions",
            "https://www.art.gov.au/about-us",
        ],
    },
    "Austrade - Business Visas": {
        "base": "https://www.austrade.gov.au",
        "department": "Australian Trade and Investment Commission",
        "urls": [
            "https://www.austrade.gov.au/en/invest/investor-visas",
        ],
    },
    "Department of Education": {
        "base": "https://www.education.gov.au",
        "department": "Department of Education",
        "urls": [
            "https://www.education.gov.au/international-students",
            "https://www.education.gov.au/international-students/student-visa",
        ],
    },
    "Services Australia": {
        "base": "https://www.servicesaustralia.gov.au",
        "department": "Services Australia",
        "urls": [
            "https://www.servicesaustralia.gov.au/newly-arrived-residents",
            "https://www.servicesaustralia.gov.au/visa-holders-and-immigrants",
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

    # ── State & Territory Nomination Programs ──────────────────────────────

    "NSW Government - Skilled Migration": {
        "base": "https://www.nsw.gov.au",
        "department": "NSW Government - Department of Home Affairs State Nomination",
        "urls": [
            "https://www.nsw.gov.au/topics/skilled-worker-visas",
            "https://www.nsw.gov.au/topics/skilled-worker-visas/skilled-nominated-visa-subclass-190",
            "https://www.nsw.gov.au/topics/skilled-worker-visas/skilled-work-regional-visa-subclass-491",
            "https://www.nsw.gov.au/topics/skilled-worker-visas/how-to-apply",
            "https://www.nsw.gov.au/topics/skilled-worker-visas/occupation-lists",
        ],
    },
    "Victoria - Live in Melbourne Skilled Migration": {
        "base": "https://www.liveinmelbourne.vic.gov.au",
        "department": "Victoria State Government - Skilled and Business Migration",
        "urls": [
            "https://www.liveinmelbourne.vic.gov.au/migrate/skilled-migration",
            "https://www.liveinmelbourne.vic.gov.au/migrate/skilled-migration/skilled-nominated-visa-subclass-190",
            "https://www.liveinmelbourne.vic.gov.au/migrate/skilled-migration/skilled-work-regional-visa-subclass-491",
            "https://www.liveinmelbourne.vic.gov.au/migrate/skilled-migration/victoria-skilled-occupation-list",
            "https://www.liveinmelbourne.vic.gov.au/migrate/skilled-migration/how-to-apply-for-victoria-state-nomination",
            "https://www.liveinmelbourne.vic.gov.au/migrate/business-migration",
        ],
    },
    "Queensland - Skilled Migration": {
        "base": "https://migration.qld.gov.au",
        "department": "Queensland Government - Skilled Migration",
        "urls": [
            "https://migration.qld.gov.au/visa-options/skilled-nominated-visa-190/",
            "https://migration.qld.gov.au/visa-options/skilled-work-regional-visa-491/",
            "https://migration.qld.gov.au/visa-options/business-innovation-and-investment-visa/",
            "https://migration.qld.gov.au/how-to-apply/",
            "https://migration.qld.gov.au/occupation-lists/",
            "https://migration.qld.gov.au/program-updates/",
        ],
    },
    "South Australia - Skilled Migration": {
        "base": "https://migration.sa.gov.au",
        "department": "South Australia Government - Skilled Migration",
        "urls": [
            "https://migration.sa.gov.au/visa-options/skilled-nominated-visa-subclass-190",
            "https://migration.sa.gov.au/visa-options/skilled-work-regional-visa-subclass-491",
            "https://migration.sa.gov.au/visa-options/business-and-innovation",
            "https://migration.sa.gov.au/how-to-apply",
            "https://migration.sa.gov.au/occupation-lists",
            "https://migration.sa.gov.au/program-updates",
        ],
    },
    "Western Australia - Skilled Migration": {
        "base": "https://migration.wa.gov.au",
        "department": "Western Australia Government - Skilled Migration",
        "urls": [
            "https://migration.wa.gov.au/visa-options/skilled-nominated-visa-190/",
            "https://migration.wa.gov.au/visa-options/skilled-work-regional-visa-491/",
            "https://migration.wa.gov.au/how-to-apply/",
            "https://migration.wa.gov.au/occupation-lists/",
            "https://migration.wa.gov.au/program-updates/",
        ],
    },
    "Tasmania - Skilled Migration": {
        "base": "https://www.migration.tas.gov.au",
        "department": "Tasmania Government - Skilled Migration",
        "urls": [
            "https://www.migration.tas.gov.au/skilled_migrants",
            "https://www.migration.tas.gov.au/skilled_migrants/subclass_190",
            "https://www.migration.tas.gov.au/skilled_migrants/subclass_491",
            "https://www.migration.tas.gov.au/skilled_migrants/occupation_list",
            "https://www.migration.tas.gov.au/business_migrants",
        ],
    },
    "ACT - Skilled Migration (Canberra Your Future)": {
        "base": "https://www.canberrayourfuture.com.au",
        "department": "ACT Government - Skilled Migration",
        "urls": [
            "https://www.canberrayourfuture.com.au/migrate-to-canberra/",
            "https://www.canberrayourfuture.com.au/migrate-to-canberra/skilled-nominated-visa-190/",
            "https://www.canberrayourfuture.com.au/migrate-to-canberra/skilled-work-regional-visa-491/",
            "https://www.canberrayourfuture.com.au/migrate-to-canberra/critical-skills-list/",
            "https://www.canberrayourfuture.com.au/migrate-to-canberra/how-to-apply/",
        ],
    },
    "Northern Territory - Skilled Migration": {
        "base": "https://nt.gov.au",
        "department": "Northern Territory Government - Skilled Migration",
        "urls": [
            "https://nt.gov.au/migration/overview",
            "https://nt.gov.au/migration/skilled-migrants",
            "https://nt.gov.au/migration/skilled-migrants/skilled-nominated-visa-subclass-190",
            "https://nt.gov.au/migration/skilled-migrants/skilled-work-regional-visa-subclass-491",
            "https://nt.gov.au/migration/skilled-migrants/occupation-list",
            "https://nt.gov.au/migration/business-migrants",
        ],
    },
}
