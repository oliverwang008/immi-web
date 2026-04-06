export interface VisaType {
  subclass: string;
  name: string;
  shortName: string;
  category: "points_tested" | "provisional";
  description: string;
  color: string;
}

export const VISA_TYPES: VisaType[] = [
  {
    subclass: "189",
    name: "Skilled Independent Visa",
    shortName: "Subclass 189",
    category: "points_tested",
    description: "Permanent residence for skilled workers not sponsored by an employer or family member, or nominated by a state/territory government.",
    color: "#FFD200",
  },
  {
    subclass: "190",
    name: "Skilled Nominated Visa",
    shortName: "Subclass 190",
    category: "points_tested",
    description: "Permanent residence for skilled workers nominated by a state or territory government.",
    color: "#00A651",
  },
  {
    subclass: "491",
    name: "Skilled Work Regional (Provisional) Visa",
    shortName: "Subclass 491",
    category: "provisional",
    description: "Provisional visa for skilled workers nominated by a state/territory or sponsored by an eligible family member to live and work in regional Australia.",
    color: "#8BB8DC",
  },
];

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
export const STATE_SPONSORED_VISAS = ["190", "491"];

/** 491 also allows family sponsorship */
export const FAMILY_SPONSORED_VISAS = ["491"];

export function isStateSponsored(subclass: string): boolean {
  return STATE_SPONSORED_VISAS.includes(subclass);
}

export function getVisaBySubclass(subclass: string): VisaType | undefined {
  return VISA_TYPES.find((v) => v.subclass === subclass);
}
