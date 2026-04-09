export interface VisaType {
  subclass: string;
  name: string;
  shortName: string;
  category: "skilled" | "employer_sponsored" | "family" | "student" | "temporary" | "business" | "regional";
  description: string;
  color: string;
  hasOccupation: boolean;
  hasPoints: boolean;
}

export const SKILL_VISA_SUBCLASSES = ["189", "190", "491"];

export const ALL_VISA_TYPES: VisaType[] = [
  // ── Skilled (points-tested) ─────────────────────────────────────────
  {
    subclass: "189", name: "Skilled Independent Visa", shortName: "Subclass 189",
    category: "skilled",
    description: "Permanent residence for skilled workers not sponsored by employer, family member, or state/territory.",
    color: "#FFD200", hasOccupation: true, hasPoints: true,
  },
  {
    subclass: "190", name: "Skilled Nominated Visa", shortName: "Subclass 190",
    category: "skilled",
    description: "Permanent residence for skilled workers nominated by a state or territory government.",
    color: "#00A651", hasOccupation: true, hasPoints: true,
  },
  {
    subclass: "491", name: "Skilled Work Regional (Provisional)", shortName: "Subclass 491",
    category: "regional",
    description: "Provisional visa for skilled workers nominated by a state/territory or sponsored by an eligible family member to live in regional Australia.",
    color: "#8BB8DC", hasOccupation: true, hasPoints: true,
  },
  {
    subclass: "191", name: "Permanent Residence (Skilled Regional)", shortName: "Subclass 191",
    category: "regional",
    description: "Permanent visa for holders of a 491 or 494 who have lived and worked in regional Australia.",
    color: "#4ADE80", hasOccupation: false, hasPoints: false,
  },
  // ── Employer Sponsored ──────────────────────────────────────────────
  {
    subclass: "482", name: "Temporary Skill Shortage Visa", shortName: "Subclass 482",
    category: "employer_sponsored",
    description: "Temporary visa to work in Australia where an employer cannot source an Australian for the role.",
    color: "#F97316", hasOccupation: true, hasPoints: false,
  },
  {
    subclass: "186", name: "Employer Nomination Scheme Visa", shortName: "Subclass 186",
    category: "employer_sponsored",
    description: "Permanent visa for skilled workers nominated by an Australian employer.",
    color: "#EF4444", hasOccupation: true, hasPoints: false,
  },
  {
    subclass: "494", name: "Skilled Employer Sponsored Regional", shortName: "Subclass 494",
    category: "regional",
    description: "Provisional visa for skilled workers in regional Australia sponsored by an approved employer.",
    color: "#A78BFA", hasOccupation: true, hasPoints: false,
  },
  // ── Graduate / Student ──────────────────────────────────────────────
  {
    subclass: "485", name: "Temporary Graduate Visa", shortName: "Subclass 485",
    category: "temporary",
    description: "Temporary visa allowing graduates from Australian institutions to live, study and work in Australia.",
    color: "#FB923C", hasOccupation: false, hasPoints: false,
  },
  {
    subclass: "500", name: "Student Visa", shortName: "Subclass 500",
    category: "student",
    description: "Visa to study full-time in a registered course in Australia.",
    color: "#38BDF8", hasOccupation: false, hasPoints: false,
  },
  // ── Family ──────────────────────────────────────────────────────────
  {
    subclass: "820", name: "Partner Visa (Temporary)", shortName: "Subclass 820",
    category: "family",
    description: "Temporary visa for partners (spouse or de facto) of Australian citizens or permanent residents.",
    color: "#F472B6", hasOccupation: false, hasPoints: false,
  },
  {
    subclass: "801", name: "Partner Visa (Permanent)", shortName: "Subclass 801",
    category: "family",
    description: "Permanent visa granted after holding a Subclass 820 temporary partner visa.",
    color: "#DB2777", hasOccupation: false, hasPoints: false,
  },
  {
    subclass: "309", name: "Partner Visa (Provisional, Offshore)", shortName: "Subclass 309",
    category: "family",
    description: "Provisional visa for offshore partners of Australian citizens or permanent residents.",
    color: "#EC4899", hasOccupation: false, hasPoints: false,
  },
  {
    subclass: "100", name: "Partner Visa (Permanent, Offshore)", shortName: "Subclass 100",
    category: "family",
    description: "Permanent offshore partner visa, granted after holding a Subclass 309.",
    color: "#BE185D", hasOccupation: false, hasPoints: false,
  },
  {
    subclass: "143", name: "Contributory Parent Visa", shortName: "Subclass 143",
    category: "family",
    description: "Permanent visa for parents of Australian citizens, PRs or eligible New Zealand citizens.",
    color: "#C084FC", hasOccupation: false, hasPoints: false,
  },
  {
    subclass: "103", name: "Parent Visa", shortName: "Subclass 103",
    category: "family",
    description: "Permanent visa for parents with the balance of family test satisfied.",
    color: "#818CF8", hasOccupation: false, hasPoints: false,
  },
  // ── Business / Investment ───────────────────────────────────────────
  {
    subclass: "188", name: "Business Innovation and Investment (Provisional)", shortName: "Subclass 188",
    category: "business",
    description: "Provisional visa for people wanting to own or manage a business or make investments in Australia.",
    color: "#34D399", hasOccupation: false, hasPoints: false,
  },
  {
    subclass: "132", name: "Business Talent (Permanent) Visa", shortName: "Subclass 132",
    category: "business",
    description: "Permanent visa for significant business owners or investors nominated by a state or territory.",
    color: "#2DD4BF", hasOccupation: false, hasPoints: false,
  },
  // ── Working Holiday ─────────────────────────────────────────────────
  {
    subclass: "417", name: "Working Holiday Visa", shortName: "Subclass 417",
    category: "temporary",
    description: "Temporary visa for young people from eligible countries to holiday and work in Australia.",
    color: "#FBBF24", hasOccupation: false, hasPoints: false,
  },
  {
    subclass: "462", name: "Work and Holiday Visa", shortName: "Subclass 462",
    category: "temporary",
    description: "Temporary visa for young adults from specific countries to holiday and work in Australia.",
    color: "#FCD34D", hasOccupation: false, hasPoints: false,
  },
  // ── Other ───────────────────────────────────────────────────────────
  {
    subclass: "408", name: "Temporary Activity Visa", shortName: "Subclass 408",
    category: "temporary",
    description: "Short-term visa for specific temporary activities in Australia.",
    color: "#9CA3AF", hasOccupation: false, hasPoints: false,
  },
];

/** Backward-compatible alias for the 3 points-tested skilled visas */
export const VISA_TYPES = ALL_VISA_TYPES.filter((v) => SKILL_VISA_SUBCLASSES.includes(v.subclass));

export const ALL_STATUSES = [
  { key: "eoi_invited", label: "EOI Invited (ITA Received)" },
  { key: "grant_received", label: "Visa Granted" },
];

export const AUSTRALIAN_STATES = [
  { code: "NSW", name: "New South Wales" },
  { code: "VIC", name: "Victoria" },
  { code: "QLD", name: "Queensland" },
  { code: "SA", name: "South Australia" },
  { code: "WA", name: "Western Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "NT", name: "Northern Territory" },
  { code: "ACT", name: "Australian Capital Territory" },
];

/** Visas that require a sponsoring state / territory nomination */
export const STATE_SPONSORED_VISAS = ["190", "491", "494"];

/** 491 also allows family sponsorship */
export const FAMILY_SPONSORED_VISAS = ["491"];

export function isStateSponsored(subclass: string): boolean {
  return STATE_SPONSORED_VISAS.includes(subclass);
}

export function getVisaBySubclass(subclass: string): VisaType | undefined {
  return ALL_VISA_TYPES.find((v) => v.subclass === subclass);
}

/** Group label for display */
export const VISA_CATEGORY_LABELS: Record<VisaType["category"], string> = {
  skilled: "Skilled (Points-Tested)",
  regional: "Regional",
  employer_sponsored: "Employer Sponsored",
  student: "Student",
  temporary: "Temporary / Holiday",
  family: "Family",
  business: "Business & Investment",
};
