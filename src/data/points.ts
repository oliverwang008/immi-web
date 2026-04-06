export interface PointsCriterion {
  key: keyof PointsScore;
  label: string; // translation key suffix
  options: { value: number; label: string }[];
  applicableTo?: string[]; // if undefined, applies to all points-tested visas
}

export interface PointsScore {
  age: number;
  english: number;
  overseasEmployment: number;
  australianEmployment: number;
  education: number;
  australianStudy: number;
  specialistEducation: number;
  communityLanguage: number;
  regionalStudy: number;
  partnerSkills: number;
  professionalYear: number;
  nomination: number;
}

export const POINTS_TESTED_VISAS = ["189", "190", "491"];

/** -1 = not yet selected (shows placeholder); ≥0 = explicitly chosen */
export const UNSET_POINTS = -1;

export const DEFAULT_POINTS_SCORE: PointsScore = {
  age: UNSET_POINTS,
  english: UNSET_POINTS,
  overseasEmployment: UNSET_POINTS,
  australianEmployment: UNSET_POINTS,
  education: UNSET_POINTS,
  australianStudy: UNSET_POINTS,
  specialistEducation: UNSET_POINTS,
  communityLanguage: UNSET_POINTS,
  regionalStudy: UNSET_POINTS,
  partnerSkills: UNSET_POINTS,
  professionalYear: UNSET_POINTS,
  nomination: UNSET_POINTS,
};

export const POINTS_CRITERIA: PointsCriterion[] = [
  {
    key: "age",
    label: "age",
    options: [
      { value: 0, label: "45–49 years (0 pts)" },
      { value: 15, label: "40–44 years (15 pts)" },
      { value: 25, label: "18–24 years (25 pts)" },
      { value: 25, label: "33–39 years (25 pts)" },
      { value: 30, label: "25–32 years (30 pts)" },
    ],
  },
  {
    key: "english",
    label: "english",
    options: [
      { value: 0, label: "Competent — IELTS 6 / PTE 50 (0 pts)" },
      { value: 10, label: "Proficient — IELTS 7 / PTE 65 (10 pts)" },
      { value: 20, label: "Superior — IELTS 8 / PTE 79 (20 pts)" },
    ],
  },
  {
    key: "overseasEmployment",
    label: "overseasEmployment",
    options: [
      { value: 0, label: "Less than 3 years (0 pts)" },
      { value: 5, label: "3 to less than 5 years (5 pts)" },
      { value: 10, label: "5 to less than 8 years (10 pts)" },
      { value: 15, label: "8 years or more (15 pts)" },
    ],
  },
  {
    key: "australianEmployment",
    label: "australianEmployment",
    options: [
      { value: 0, label: "Less than 1 year (0 pts)" },
      { value: 5, label: "1 to less than 3 years (5 pts)" },
      { value: 10, label: "3 to less than 5 years (10 pts)" },
      { value: 15, label: "5 to less than 8 years (15 pts)" },
      { value: 20, label: "8 years or more (20 pts)" },
    ],
  },
  {
    key: "education",
    label: "education",
    options: [
      { value: 0, label: "No degree (0 pts)" },
      { value: 10, label: "Diploma or trade qualification (10 pts)" },
      { value: 15, label: "Bachelor degree or higher (15 pts)" },
      { value: 20, label: "PhD from Australian institution (20 pts)" },
    ],
  },
  {
    key: "australianStudy",
    label: "australianStudy",
    options: [
      { value: 0, label: "Does not meet requirement (0 pts)" },
      { value: 5, label: "Meets Australian study requirement (5 pts)" },
    ],
  },
  {
    key: "specialistEducation",
    label: "specialistEducation",
    options: [
      { value: 0, label: "Not applicable (0 pts)" },
      { value: 10, label: "Masters by research / PhD in STEM (10 pts)" },
    ],
  },
  {
    key: "communityLanguage",
    label: "communityLanguage",
    options: [
      { value: 0, label: "No (0 pts)" },
      { value: 5, label: "Yes — NAATI credentialled (5 pts)" },
    ],
  },
  {
    key: "regionalStudy",
    label: "regionalStudy",
    options: [
      { value: 0, label: "No (0 pts)" },
      { value: 5, label: "Yes — studied in regional Australia (5 pts)" },
    ],
  },
  {
    key: "partnerSkills",
    label: "partnerSkills",
    options: [
      { value: 0, label: "Partner with Competent English (0 pts)" },
      { value: 5, label: "Single / Partner is AUS citizen or PR (5 pts)" },
      { value: 10, label: "Skilled partner — scored 65+ pts (10 pts)" },
    ],
  },
  {
    key: "professionalYear",
    label: "professionalYear",
    options: [
      { value: 0, label: "No (0 pts)" },
      { value: 5, label: "Yes — completed Professional Year in Australia (5 pts)" },
    ],
  },
  {
    key: "nomination",
    label: "nomination",
    options: [
      { value: 0, label: "No nomination (0 pts)" },
      { value: 5, label: "State / Territory nomination — SC 190 (5 pts)" },
      { value: 15, label: "State / Territory / Family nomination — SC 491 (15 pts)" },
    ],
    applicableTo: ["190", "491"],
  },
];

/** -1 (UNSET_POINTS) contributes 0 to the total */
export function calcTotalPoints(score: PointsScore): number {
  return Object.values(score).reduce((sum, v) => sum + Math.max(0, v), 0);
}

export const POINTS_MIN = 65;
