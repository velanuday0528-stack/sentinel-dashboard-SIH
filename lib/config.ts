// ============================================================================
// XIMUS 2026 — CENTRALIZED EDITABLE CONFIGURATION
// ----------------------------------------------------------------------------
// Replace the placeholder values below with your real information.
// You do NOT need to touch any other file to update the site content.
// ============================================================================

// -- Registration -----------------------------------------------------------
// Paste your Google Form (or any registration) link here.
export const REGISTRATION_LINK = "https://forms.gle/naEjG7rwwcLp5QpL7"

// -- College / Institution --------------------------------------------------
export const COLLEGE_NAME = "S.A. ENGINEERING COLLEGE"
export const COLLEGE_SUBTITLE =
  "Autonomous — Institute Level Research Centre, Affiliated to Anna University, Chennai • Accredited by NAAC 'A' Grade & ISO 9001:2015 Certified Institution"
export const COLLEGE_LOGO = "/sa-engineering-college-logo.png" // replace with your logo path
export const COLLEGE_DESCRIPTION =
  "[COLLEGE DESCRIPTION] — Add a short paragraph about your institution here: its history, accreditation, achievements and what makes it stand out."
export const COLLEGE_LOCATION = "[COLLEGE LOCATION]"
export const COLLEGE_VISION =
  "[COLLEGE VISION / MISSION] — Add your institution's vision and mission statement here."
export const SYMPOSIUM_INFO =
  "[SYMPOSIUM INFORMATION] — Add a short introduction to the XIMUS 2026 technical symposium here."

// -- Department --------------------------------------------------------------
export const DEPARTMENT_NAME = "DEPARTMENT OF ELECTRONICS AND COMMUNICATION ENGINEERING"
export const ECE_DESCRIPTION =
  "[ECE DEPARTMENT DESCRIPTION] — Add a description of the ECE department here: labs, specializations, faculty strength and focus areas such as VLSI, embedded systems, communication and IoT."

// -- Contact -----------------------------------------------------------------
export const CONTACT_EMAIL = "ece.ximus@sac.ac.in"

// Optional social / contact links. Leave href empty ("") to hide a link.
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "" },
  { label: "LinkedIn", href: "" },
  { label: "Website", href: "" },
]

// -- Event tagline -----------------------------------------------------------
export const EVENT_TAGLINE = "CONNECT • CREATE • COMPETE"
export const REGISTRATION_STATUS = "REGISTRATIONS ARE OPEN"
export const REGISTRATION_SUBTEXT = "Registration is open for all eligible participants."

// -- Events ------------------------------------------------------------------
export type EventCategory = "TECHNICAL" | "NON-TECHNICAL"

export interface SymposiumEvent {
  id: string
  number: string
  name: string
  category: EventCategory
  icon: string // lucide icon name key (see event-icon.tsx)
  shortDescription: string
  description: string
  teamSize: string
  venue: string
  date: string
  time: string
  fee: string
  rules: string[]
  extraLabel: string // e.g. "Topics", "Rounds", "Components"
  extraItems: string[]
  contactPerson: string
  // Optional per-event registration link. Falls back to REGISTRATION_LINK.
  registrationLink?: string
}

export const TECHNICAL_EVENTS: SymposiumEvent[] = [
  {
    id: "paper-presentation",
    number: "01",
    name: "PAPER PRESENTATION",
    category: "TECHNICAL",
    icon: "presentation",
    shortDescription: "Present your research, ideas and innovations before an expert panel.",
    description: "[EVENT DESCRIPTION] — Describe the paper presentation event here.",
    teamSize: "[TEAM SIZE]",
    venue: "[VENUE]",
    date: "[DATE]",
    time: "[TIME]",
    fee: "[REGISTRATION FEE]",
    rules: [
      "[RULE 1]",
      "[RULE 2]",
      "[RULE 3]",
    ],
    extraLabel: "Topics",
    extraItems: ["[TOPIC 1]", "[TOPIC 2]", "[TOPIC 3]"],
    contactPerson: "[CONTACT PERSON]",
  },
  {
    id: "electro-quiz",
    number: "02",
    name: "ELECTRO QUIZ",
    category: "TECHNICAL",
    icon: "quiz",
    shortDescription: "Test your electronics knowledge across fast-paced quiz rounds.",
    description: "[EVENT DESCRIPTION] — Describe the electro quiz event here.",
    teamSize: "[TEAM SIZE]",
    venue: "[VENUE]",
    date: "[DATE]",
    time: "[TIME]",
    fee: "[REGISTRATION FEE]",
    rules: [
      "[RULE 1]",
      "[RULE 2]",
      "[RULE 3]",
    ],
    extraLabel: "Rounds",
    extraItems: ["[ROUND 1]", "[ROUND 2]", "[ROUND 3]"],
    contactPerson: "[CONTACT PERSON]",
  },
  {
    id: "circuit-craze",
    number: "03",
    name: "CIRCUIT CRAZE",
    category: "TECHNICAL",
    icon: "circuit",
    shortDescription: "Design, debug and build circuits against the clock.",
    description: "[EVENT DESCRIPTION] — Describe the circuit craze event here.",
    teamSize: "[TEAM SIZE]",
    venue: "[VENUE]",
    date: "[DATE]",
    time: "[TIME]",
    fee: "[REGISTRATION FEE]",
    rules: [
      "[RULE 1]",
      "[RULE 2]",
      "[RULE 3]",
    ],
    extraLabel: "Components / Requirements",
    extraItems: ["[COMPONENT 1]", "[COMPONENT 2]", "[COMPONENT 3]"],
    contactPerson: "[CONTACT PERSON]",
  },
]

export const NON_TECHNICAL_EVENTS: SymposiumEvent[] = [
  {
    id: "ipl-auction",
    number: "04",
    name: "IPL AUCTION",
    category: "NON-TECHNICAL",
    icon: "auction",
    shortDescription: "Strategize, bid smart and build your dream cricket squad.",
    description: "[EVENT DESCRIPTION] — Describe the IPL auction event here.",
    teamSize: "[TEAM SIZE]",
    venue: "[VENUE]",
    date: "[DATE]",
    time: "[TIME]",
    fee: "[REGISTRATION FEE]",
    rules: [
      "[RULE 1]",
      "[RULE 2]",
      "[RULE 3]",
    ],
    extraLabel: "Rounds",
    extraItems: ["[ROUND 1]", "[ROUND 2]", "[ROUND 3]"],
    contactPerson: "[CONTACT PERSON]",
  },
  {
    id: "visual-link",
    number: "05",
    name: "VISUAL LINK",
    category: "NON-TECHNICAL",
    icon: "visual",
    shortDescription: "Connect the visual clues and crack the hidden link.",
    description: "[EVENT DESCRIPTION] — Describe the visual link event here.",
    teamSize: "[TEAM SIZE]",
    venue: "[VENUE]",
    date: "[DATE]",
    time: "[TIME]",
    fee: "[REGISTRATION FEE]",
    rules: [
      "[RULE 1]",
      "[RULE 2]",
      "[RULE 3]",
    ],
    extraLabel: "Rounds",
    extraItems: ["[ROUND 1]", "[ROUND 2]", "[ROUND 3]"],
    contactPerson: "[CONTACT PERSON]",
  },
  {
    id: "sound-wave",
    number: "06",
    name: "SOUND WAVE",
    category: "NON-TECHNICAL",
    icon: "sound",
    shortDescription: "Identify tracks, tunes and beats in this musical showdown.",
    description: "[EVENT DESCRIPTION] — Describe the sound wave event here.",
    teamSize: "[TEAM SIZE]",
    venue: "[VENUE]",
    date: "[DATE]",
    time: "[TIME]",
    fee: "[REGISTRATION FEE]",
    rules: [
      "[RULE 1]",
      "[RULE 2]",
      "[RULE 3]",
    ],
    extraLabel: "Rounds",
    extraItems: ["[ROUND 1]", "[ROUND 2]", "[ROUND 3]"],
    contactPerson: "[CONTACT PERSON]",
  },
]

export const ALL_EVENTS = [...TECHNICAL_EVENTS, ...NON_TECHNICAL_EVENTS]

// -- Coordinators ------------------------------------------------------------
export interface Coordinator {
  name: string
  role: string
  photo: string // replace with a photo path, e.g. "/coordinators/name.jpg"
}

export const OVERALL_COORDINATORS: Coordinator[] = [
  { name: "[OVERALL COORDINATOR 01]", role: "[DESIGNATION / ROLE]", photo: "" },
  { name: "[OVERALL COORDINATOR 02]", role: "[DESIGNATION / ROLE]", photo: "" },
  { name: "[OVERALL COORDINATOR 03]", role: "[DESIGNATION / ROLE]", photo: "" },
]

export const STAFF_COORDINATORS: Coordinator[] = [
  { name: "[STAFF COORDINATOR 01]", role: "[DESIGNATION]", photo: "" },
  { name: "[STAFF COORDINATOR 02]", role: "[DESIGNATION]", photo: "" },
  { name: "[STAFF COORDINATOR 03]", role: "[DESIGNATION]", photo: "" },
]

export const STUDENT_COORDINATORS: Coordinator[] = [
  { name: "[STUDENT COORDINATOR 01]", role: "[ROLE]", photo: "" },
  { name: "[STUDENT COORDINATOR 02]", role: "[ROLE]", photo: "" },
  { name: "[STUDENT COORDINATOR 03]", role: "[ROLE]", photo: "" },
]
