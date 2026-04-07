export interface Occupation {
  code: string;
  title: string;
  category: OccupationCategory;
  list: OccupationList[];
}

export type OccupationCategory =
  | "ICT"
  | "Engineering"
  | "Healthcare"
  | "Education"
  | "Accounting & Finance"
  | "Architecture & Construction"
  | "Science & Research"
  | "Trades & Technical"
  | "Management & Business"
  | "Legal & Social"
  | "Agriculture"
  | "Arts & Media"
  | "Other";

export type OccupationList = "CSOL" | "ROL" | "TSS" | "GTI";

export const OCCUPATION_CATEGORIES: OccupationCategory[] = [
  "ICT",
  "Engineering",
  "Healthcare",
  "Education",
  "Accounting & Finance",
  "Architecture & Construction",
  "Science & Research",
  "Trades & Technical",
  "Management & Business",
  "Legal & Social",
  "Agriculture",
  "Arts & Media",
  "Other",
];

export const CATEGORY_COLORS: Record<OccupationCategory, string> = {
  "ICT": "#6b9fe4",
  "Engineering": "#d4a853",
  "Healthcare": "#3aab73",
  "Education": "#e07c5a",
  "Accounting & Finance": "#c47ac7",
  "Architecture & Construction": "#5ab8c4",
  "Science & Research": "#f7b731",
  "Trades & Technical": "#e05252",
  "Management & Business": "#8bba8e",
  "Legal & Social": "#b87fe4",
  "Agriculture": "#78b860",
  "Arts & Media": "#e48b6b",
  "Other": "#8ba3bf",
};

export const OCCUPATIONS: Occupation[] = [
  // ICT
  { code: "261111", title: "ICT Business Analyst", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "261112", title: "Systems Analyst", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "261113", title: "Systems Architect", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "261211", title: "Multimedia Specialist", category: "ICT", list: ["CSOL"] },
  { code: "261212", title: "Web Developer", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "261311", title: "Analyst Programmer", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "261312", title: "Developer Programmer", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "261313", title: "Software Engineer", category: "ICT", list: ["CSOL", "TSS", "GTI"] },
  { code: "261314", title: "Software Tester", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "261315", title: "Lead Developer", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "261399", title: "Software and Applications Programmer (nec)", category: "ICT", list: ["CSOL"] },
  { code: "262111", title: "Database Administrator", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "262112", title: "ICT Security Specialist", category: "ICT", list: ["CSOL", "TSS", "GTI"] },
  { code: "262113", title: "Systems Administrator", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "263111", title: "Computer Network and Systems Engineer", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "263112", title: "Network Administrator", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "263113", title: "Network Analyst", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "263211", title: "ICT Quality Assurance Engineer", category: "ICT", list: ["CSOL"] },
  { code: "263212", title: "ICT Support Engineer", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "263213", title: "ICT Systems Test Engineer", category: "ICT", list: ["CSOL"] },
  { code: "263299", title: "ICT Support and Test Engineers (nec)", category: "ICT", list: ["CSOL"] },
  { code: "135111", title: "ICT Director", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "135112", title: "Project Manager (ICT)", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "261114", title: "Cyber Security Analyst", category: "ICT", list: ["CSOL", "TSS", "GTI"] },
  { code: "261199", title: "ICT Analyst (nec)", category: "ICT", list: ["CSOL"] },
  { code: "261241", title: "Data Scientist", category: "ICT", list: ["CSOL", "TSS", "GTI"] },
  { code: "261242", title: "Machine Learning Engineer", category: "ICT", list: ["CSOL", "GTI"] },
  { code: "261316", title: "DevOps Engineer", category: "ICT", list: ["CSOL", "TSS"] },
  { code: "261317", title: "Cloud Solutions Architect", category: "ICT", list: ["CSOL", "TSS"] },

  // Engineering
  { code: "233111", title: "Chemical Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233113", title: "Process Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233112", title: "Materials Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233211", title: "Civil Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233212", title: "Geotechnical Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233213", title: "Quantity Surveyor", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233214", title: "Structural Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233215", title: "Transport Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233311", title: "Electrical Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233411", title: "Electronics Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233511", title: "Industrial Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233512", title: "Mechanical Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233513", title: "Production or Plant Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233611", title: "Mining Engineer (exc. Petroleum)", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233612", title: "Petroleum Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233911", title: "Aeronautical Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233912", title: "Agricultural Engineer", category: "Engineering", list: ["CSOL"] },
  { code: "233913", title: "Biomedical Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233914", title: "Engineering Technologist", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233915", title: "Environmental Engineer", category: "Engineering", list: ["CSOL", "TSS"] },
  { code: "233916", title: "Naval Architect", category: "Engineering", list: ["CSOL"] },
  { code: "233999", title: "Engineering Professional (nec)", category: "Engineering", list: ["CSOL"] },
  { code: "312311", title: "Electrical Engineering Technician", category: "Engineering", list: ["CSOL"] },
  { code: "312911", title: "Maintenance Planner", category: "Engineering", list: ["CSOL"] },
  { code: "312111", title: "Architectural Drafter", category: "Engineering", list: ["CSOL"] },
  { code: "312211", title: "Civil Engineering Drafter", category: "Engineering", list: ["CSOL"] },
  { code: "312311", title: "Electrical Engineering Draftsperson", category: "Engineering", list: ["CSOL"] },

  // Healthcare
  { code: "251111", title: "Dietitian", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "251211", title: "Medical Diagnostic Radiographer", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "251212", title: "Medical Radiation Therapist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "251213", title: "Nuclear Medicine Technologist", category: "Healthcare", list: ["CSOL"] },
  { code: "251214", title: "Sonographer", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "251311", title: "Occupational Therapist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "251411", title: "Physiotherapist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "251511", title: "Podiatrist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "251912", title: "Orthotist or Prosthetist", category: "Healthcare", list: ["CSOL"] },
  { code: "252111", title: "General Medical Practitioner", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252311", title: "Specialist Physician (General Medicine)", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252411", title: "Psychiatrist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252511", title: "Surgeon", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252999", title: "Medical Practitioner (nec)", category: "Healthcare", list: ["CSOL"] },
  { code: "253111", title: "General Practitioner", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "253311", title: "Anaesthetist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "253411", title: "Emergency Medicine Specialist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "253999", title: "Specialist Medical Practitioner (nec)", category: "Healthcare", list: ["CSOL"] },
  { code: "254111", title: "Midwife", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "254411", title: "Registered Nurse (General)", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "254412", title: "Registered Nurse (Mental Health)", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "254413", title: "Registered Nurse (Critical Care & Emergency)", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "254499", title: "Registered Nurse (nec)", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252312", title: "Cardiologist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252411", title: "Psychiatrist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252711", title: "Ophthalmologist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252811", title: "Pathologist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252911", title: "Radiologist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252413", title: "Dentist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "252414", title: "Dental Specialist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "251611", title: "Optometrist", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "251612", title: "Orthoptist", category: "Healthcare", list: ["CSOL"] },
  { code: "251911", title: "Health Promotion Officer", category: "Healthcare", list: ["CSOL"] },
  { code: "254211", title: "Nurse Practitioner", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "254212", title: "Registered Nurse (Paediatrics)", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "254213", title: "Registered Nurse (Aged Care)", category: "Healthcare", list: ["CSOL", "TSS"] },
  { code: "411411", title: "Enrolled Nurse", category: "Healthcare", list: ["CSOL", "TSS"] },

  // Education
  { code: "241111", title: "Early Childhood (Pre-Primary School) Teacher", category: "Education", list: ["CSOL", "TSS"] },
  { code: "241213", title: "Primary School Teacher", category: "Education", list: ["CSOL", "TSS"] },
  { code: "241411", title: "Secondary School Teacher", category: "Education", list: ["CSOL", "TSS"] },
  { code: "241511", title: "Special Education Teacher", category: "Education", list: ["CSOL", "TSS"] },
  { code: "242111", title: "University Lecturer", category: "Education", list: ["CSOL", "TSS"] },
  { code: "242211", title: "Vocational Education Teacher", category: "Education", list: ["CSOL", "TSS"] },
  { code: "249111", title: "Education Adviser", category: "Education", list: ["CSOL"] },
  { code: "249211", title: "Librarian", category: "Education", list: ["CSOL"] },
  { code: "249311", title: "Careers Counsellor", category: "Education", list: ["CSOL"] },

  // Accounting & Finance
  { code: "221111", title: "Accountant (General)", category: "Accounting & Finance", list: ["CSOL", "TSS"] },
  { code: "221112", title: "Management Accountant", category: "Accounting & Finance", list: ["CSOL", "TSS"] },
  { code: "221113", title: "Taxation Accountant", category: "Accounting & Finance", list: ["CSOL", "TSS"] },
  { code: "221211", title: "Company Secretary", category: "Accounting & Finance", list: ["CSOL"] },
  { code: "221213", title: "External Auditor", category: "Accounting & Finance", list: ["CSOL", "TSS"] },
  { code: "221214", title: "Internal Auditor", category: "Accounting & Finance", list: ["CSOL"] },
  { code: "222111", title: "Financial Investment Adviser", category: "Accounting & Finance", list: ["CSOL"] },
  { code: "222311", title: "Finance Manager", category: "Accounting & Finance", list: ["CSOL", "TSS"] },
  { code: "132211", title: "Finance Director", category: "Accounting & Finance", list: ["CSOL"] },
  { code: "222112", title: "Financial Investment Manager", category: "Accounting & Finance", list: ["CSOL"] },
  { code: "224111", title: "Actuary", category: "Accounting & Finance", list: ["CSOL", "TSS"] },
  { code: "224113", title: "Statistician", category: "Accounting & Finance", list: ["CSOL", "TSS"] },
  { code: "224211", title: "Economist", category: "Accounting & Finance", list: ["CSOL"] },
  { code: "224311", title: "Intelligence Officer", category: "Accounting & Finance", list: ["CSOL"] },
  { code: "224411", title: "Land Economist", category: "Accounting & Finance", list: ["CSOL"] },
  { code: "224511", title: "Logistics and Supply Chain Manager", category: "Accounting & Finance", list: ["CSOL"] },
  { code: "224712", title: "Valuer", category: "Accounting & Finance", list: ["CSOL"] },

  // Architecture & Construction
  { code: "232111", title: "Architect", category: "Architecture & Construction", list: ["CSOL", "TSS"] },
  { code: "232211", title: "Landscape Architect", category: "Architecture & Construction", list: ["CSOL"] },
  { code: "232311", title: "Cartographer", category: "Architecture & Construction", list: ["CSOL"] },
  { code: "232312", title: "Surveyor", category: "Architecture & Construction", list: ["CSOL", "TSS"] },
  { code: "232411", title: "Planner (Urban and Regional)", category: "Architecture & Construction", list: ["CSOL", "TSS"] },
  { code: "232511", title: "Interior Designer", category: "Architecture & Construction", list: ["CSOL"] },
  { code: "132111", title: "Construction Project Manager", category: "Architecture & Construction", list: ["CSOL", "TSS"] },
  { code: "133111", title: "Engineering Manager", category: "Architecture & Construction", list: ["CSOL"] },
  { code: "312412", title: "Building Inspector", category: "Architecture & Construction", list: ["CSOL"] },

  // Science & Research
  { code: "234111", title: "Agricultural Scientist", category: "Science & Research", list: ["CSOL"] },
  { code: "234211", title: "Chemist", category: "Science & Research", list: ["CSOL", "TSS"] },
  { code: "234311", title: "Environmental Consultant", category: "Science & Research", list: ["CSOL", "TSS"] },
  { code: "234312", title: "Environmental Research Scientist", category: "Science & Research", list: ["CSOL"] },
  { code: "234411", title: "Geologist", category: "Science & Research", list: ["CSOL", "TSS"] },
  { code: "234412", title: "Geophysicist", category: "Science & Research", list: ["CSOL", "TSS"] },
  { code: "234511", title: "Life Scientist (General)", category: "Science & Research", list: ["CSOL"] },
  { code: "234513", title: "Biochemist", category: "Science & Research", list: ["CSOL", "TSS", "GTI"] },
  { code: "234514", title: "Biotechnologist", category: "Science & Research", list: ["CSOL", "GTI"] },
  { code: "234611", title: "Medical Laboratory Scientist", category: "Science & Research", list: ["CSOL", "TSS"] },
  { code: "234711", title: "Physicist", category: "Science & Research", list: ["CSOL", "GTI"] },
  { code: "234914", title: "Epidemiologist", category: "Science & Research", list: ["CSOL"] },
  { code: "234912", title: "Forensic Scientist", category: "Science & Research", list: ["CSOL"] },
  { code: "234913", title: "Marine Biologist", category: "Science & Research", list: ["CSOL"] },
  { code: "234999", title: "Natural and Physical Science Professional (nec)", category: "Science & Research", list: ["CSOL"] },

  // Trades & Technical
  { code: "321111", title: "Motor Mechanic (General)", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "321211", title: "Air-conditioning and Refrigeration Mechanic", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "322211", title: "Sheetmetal Trades Worker", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "322311", title: "Structural Steel and Welding Trades Worker", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "323211", title: "Plumber (General)", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "331111", title: "Bricklayer", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "331211", title: "Carpenter", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "331212", title: "Joiner", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "333111", title: "Painting Trades Worker", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "334111", title: "Glazier", category: "Trades & Technical", list: ["CSOL"] },
  { code: "334112", title: "Roof Tiler", category: "Trades & Technical", list: ["CSOL"] },
  { code: "334113", title: "Wall and Floor Tiler", category: "Trades & Technical", list: ["CSOL"] },
  { code: "341111", title: "Electrician (General)", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "341112", title: "Electrician (Special Class)", category: "Trades & Technical", list: ["CSOL"] },
  { code: "342111", title: "Air Conditioning and Refrigeration Mechanic", category: "Trades & Technical", list: ["CSOL"] },
  { code: "351111", title: "Baker", category: "Trades & Technical", list: ["CSOL"] },
  { code: "351211", title: "Cook (General)", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "351311", title: "Pastrycook", category: "Trades & Technical", list: ["CSOL"] },
  { code: "313212", title: "ICT Support Technician", category: "Trades & Technical", list: ["CSOL"] },

  // Trades & Technical (additional)
  { code: "351411", title: "Chef", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "312212", title: "Civil Engineering Technician", category: "Trades & Technical", list: ["CSOL"] },
  { code: "312411", title: "Drafter (General)", category: "Trades & Technical", list: ["CSOL"] },
  { code: "313111", title: "ICT Customer Support Officer", category: "Trades & Technical", list: ["CSOL"] },
  { code: "322111", title: "Metal Fabricator", category: "Trades & Technical", list: ["CSOL", "TSS"] },
  { code: "323111", title: "Gas or Petroleum Operator", category: "Trades & Technical", list: ["CSOL"] },
  { code: "324111", title: "Panel Beater", category: "Trades & Technical", list: ["CSOL"] },
  { code: "342211", title: "Lift Mechanic", category: "Trades & Technical", list: ["CSOL"] },
  { code: "399111", title: "Boat Builder and Repairer", category: "Trades & Technical", list: ["CSOL"] },

  // Management & Business
  { code: "111211", title: "Corporate General Manager", category: "Management & Business", list: ["CSOL", "TSS"] },
  { code: "111311", title: "Defence Force Senior Officer", category: "Management & Business", list: ["CSOL"] },
  { code: "121111", title: "Farm Manager (General)", category: "Management & Business", list: ["CSOL"] },
  { code: "131111", title: "Advertising Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "131112", title: "Marketing Manager", category: "Management & Business", list: ["CSOL", "TSS"] },
  { code: "131113", title: "Public Relations Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "132211", title: "Finance Director", category: "Management & Business", list: ["CSOL"] },
  { code: "132311", title: "Human Resource Manager", category: "Management & Business", list: ["CSOL", "TSS"] },
  { code: "132411", title: "Policy and Planning Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "132511", title: "Research and Development Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "141111", title: "Café or Restaurant Manager", category: "Management & Business", list: ["CSOL", "TSS"] },
  { code: "141311", title: "Hotel or Motel Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "141411", title: "Licensed Club Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "223111", title: "Human Resource Adviser", category: "Management & Business", list: ["CSOL", "TSS"] },
  { code: "223112", title: "Recruitment Consultant", category: "Management & Business", list: ["CSOL", "TSS"] },
  { code: "223113", title: "Workplace Relations Adviser", category: "Management & Business", list: ["CSOL"] },
  { code: "223211", title: "ICT Trainer", category: "Management & Business", list: ["CSOL"] },
  { code: "224712", title: "Valuer", category: "Management & Business", list: ["CSOL"] },
  { code: "139911", title: "Arts Administrator or Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "139912", title: "Environmental Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "139913", title: "Laboratory Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "139914", title: "Quality Assurance Manager", category: "Management & Business", list: ["CSOL", "TSS"] },
  { code: "139915", title: "Sports Administrator", category: "Management & Business", list: ["CSOL"] },
  { code: "139999", title: "Specialist Manager (nec)", category: "Management & Business", list: ["CSOL"] },
  { code: "149211", title: "Facilities Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "149311", title: "Fleet Manager", category: "Management & Business", list: ["CSOL"] },
  { code: "511111", title: "Contract Administrator", category: "Management & Business", list: ["CSOL", "TSS"] },
  { code: "511112", title: "Project or Program Administrator", category: "Management & Business", list: ["CSOL", "TSS"] },
  { code: "225111", title: "Advertising Specialist", category: "Management & Business", list: ["CSOL"] },
  { code: "225311", title: "Marketing Specialist", category: "Management & Business", list: ["CSOL", "TSS"] },
  { code: "225112", title: "Media Planner", category: "Management & Business", list: ["CSOL"] },

  // Legal & Social
  { code: "271111", title: "Barrister", category: "Legal & Social", list: ["CSOL", "TSS"] },
  { code: "271211", title: "Solicitor", category: "Legal & Social", list: ["CSOL", "TSS"] },
  { code: "272111", title: "Counsellor", category: "Legal & Social", list: ["CSOL"] },
  { code: "272211", title: "Psychologist", category: "Legal & Social", list: ["CSOL", "TSS"] },
  { code: "272311", title: "Social Worker", category: "Legal & Social", list: ["CSOL", "TSS"] },
  { code: "272411", title: "Welfare Centre Manager", category: "Legal & Social", list: ["CSOL"] },
  { code: "272511", title: "Community Development Worker", category: "Legal & Social", list: ["CSOL"] },
  { code: "272612", title: "Migration Agent", category: "Legal & Social", list: ["CSOL"] },
  { code: "272113", title: "Rehabilitation Counsellor", category: "Legal & Social", list: ["CSOL"] },
  { code: "272114", title: "Student Counsellor", category: "Legal & Social", list: ["CSOL"] },
  { code: "272199", title: "Counsellor (nec)", category: "Legal & Social", list: ["CSOL"] },
  { code: "272999", title: "Social Professionals (nec)", category: "Legal & Social", list: ["CSOL"] },

  // Agriculture
  { code: "121211", title: "Aquaculture Farmer", category: "Agriculture", list: ["CSOL", "ROL"] },
  { code: "121311", title: "Crop Farmer (General)", category: "Agriculture", list: ["CSOL", "ROL"] },
  { code: "121411", title: "Dairy Cattle Farmer", category: "Agriculture", list: ["CSOL", "ROL"] },
  { code: "234111", title: "Agricultural Scientist", category: "Agriculture", list: ["CSOL"] },
  { code: "362111", title: "Gardener (General)", category: "Agriculture", list: ["CSOL"] },
  { code: "362311", title: "Landscape Gardener", category: "Agriculture", list: ["CSOL"] },

  // Arts & Media
  { code: "211111", title: "Musician (Instrumental)", category: "Arts & Media", list: ["CSOL"] },
  { code: "211211", title: "Actor", category: "Arts & Media", list: ["CSOL"] },
  { code: "211311", title: "Dancer or Choreographer", category: "Arts & Media", list: ["CSOL"] },
  { code: "212111", title: "Artistic Director", category: "Arts & Media", list: ["CSOL"] },
  { code: "212211", title: "Author", category: "Arts & Media", list: ["CSOL"] },
  { code: "212311", title: "Film and Video Editor", category: "Arts & Media", list: ["CSOL"] },
  { code: "212314", title: "Visual Effects Artist", category: "Arts & Media", list: ["CSOL"] },
  { code: "212411", title: "Graphic Designer", category: "Arts & Media", list: ["CSOL", "TSS"] },
  { code: "212412", title: "Illustrator", category: "Arts & Media", list: ["CSOL"] },
  { code: "212413", title: "Fashion Designer", category: "Arts & Media", list: ["CSOL"] },
  { code: "212511", title: "Journalist", category: "Arts & Media", list: ["CSOL"] },
  { code: "212913", title: "UX Designer", category: "Arts & Media", list: ["CSOL", "TSS"] },
];

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium",
  "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria", "Cambodia",
  "Cameroon", "Canada", "Chile", "China", "Colombia", "Congo (DRC)",
  "Croatia", "Cuba", "Czech Republic", "Denmark", "Ecuador", "Egypt",
  "El Salvador", "Ethiopia", "Finland", "France", "Georgia", "Germany",
  "Ghana", "Greece", "Guatemala", "Haiti", "Honduras", "Hungary",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait",
  "Kyrgyzstan", "Laos", "Lebanon", "Libya", "Lithuania", "Madagascar",
  "Malaysia", "Mauritius", "Mexico", "Moldova", "Mongolia", "Morocco",
  "Mozambique", "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nigeria",
  "Norway", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea", "Spain",
  "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

export function searchOccupations(query: string, limit = 20): Occupation[] {
  if (!query.trim()) return OCCUPATIONS.slice(0, limit);
  const q = query.toLowerCase();
  return OCCUPATIONS.filter(
    (o) =>
      o.title.toLowerCase().includes(q) ||
      o.code.includes(q) ||
      o.category.toLowerCase().includes(q)
  ).slice(0, limit);
}

export function getOccupationByCode(code: string): Occupation | undefined {
  return OCCUPATIONS.find((o) => o.code === code);
}
