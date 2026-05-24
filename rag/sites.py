"""
Official Australian immigration government websites and their key URLs.
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
}
