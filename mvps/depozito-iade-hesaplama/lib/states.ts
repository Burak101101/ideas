export type StateRule = {
  code: string;
  name: string;
  /** Calendar days after move-out to return the deposit with an itemized list of deductions. */
  days: number;
  /** Shorter deadline that applies when nothing is deducted (only where the statute says so). */
  daysNoDeductions?: number;
  /** What starts the clock, in plain words. */
  trigger: string;
  citation: string;
  sourceUrl: string;
};

// Every row was checked against the linked page on 2026-11-23.
// Not legal advice: statutes change and local (city) rules may be stricter.
export const STATES: StateRule[] = [
  {
    code: "CA",
    name: "California",
    days: 21,
    trigger: "after the tenant moves out",
    citation: "Cal. Civ. Code § 1950.5(g)",
    sourceUrl: "https://selfhelp.courts.ca.gov/guide-security-deposits",
  },
  {
    code: "FL",
    name: "Florida",
    days: 30,
    daysNoDeductions: 15,
    trigger: "after the tenant vacates (notice of claim by certified mail)",
    citation: "Fla. Stat. § 83.49(3)(a)",
    sourceUrl: "https://www.flsenate.gov/Laws/Statutes/2024/83.49",
  },
  {
    code: "MA",
    name: "Massachusetts",
    days: 30,
    trigger: "after the tenancy ends",
    citation: "M.G.L. c. 186 § 15B(4)",
    sourceUrl: "https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B",
  },
  {
    code: "MI",
    name: "Michigan",
    days: 30,
    trigger: "after occupancy ends",
    citation: "MCL 554.609",
    sourceUrl: "https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-554-609",
  },
  {
    code: "NV",
    name: "Nevada",
    days: 30,
    trigger: "after the tenancy ends",
    citation: "NRS 118A.242(4)",
    sourceUrl: "https://www.leg.state.nv.us/NRS/NRS-118A.html",
  },
  {
    code: "NY",
    name: "New York",
    days: 14,
    trigger: "after the tenant vacates",
    citation: "N.Y. Gen. Oblig. Law § 7-108(1-a)(e)",
    sourceUrl: "https://www.nysenate.gov/legislation/laws/GOB/7-108",
  },
  {
    code: "NC",
    name: "North Carolina",
    days: 30,
    trigger: "after the tenancy ends and possession is returned",
    citation: "N.C. Gen. Stat. § 42-52",
    sourceUrl: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_42/GS_42-52.html",
  },
  {
    code: "OH",
    name: "Ohio",
    days: 30,
    trigger: "after the lease ends and possession is returned",
    citation: "Ohio Rev. Code § 5321.16",
    sourceUrl: "https://codes.ohio.gov/ohio-revised-code/section-5321.16",
  },
  {
    code: "OR",
    name: "Oregon",
    days: 31,
    trigger: "after the tenancy ends and possession is returned",
    citation: "ORS 90.300(12)–(13)",
    sourceUrl: "https://oregon.public.law/statutes/ors_90.300",
  },
  {
    code: "VA",
    name: "Virginia",
    days: 45,
    trigger: "after the tenancy ends or the tenant moves out, whichever is later",
    citation: "Va. Code § 55.1-1226(A)",
    sourceUrl: "https://law.lis.virginia.gov/vacode/title55.1/chapter12/section55.1-1226/",
  },
  {
    code: "WA",
    name: "Washington",
    days: 30,
    trigger: "after the lease ends and the tenant vacates",
    citation: "RCW 59.18.280",
    sourceUrl: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.280",
  },
];

export function findState(code: string): StateRule | undefined {
  return STATES.find((s) => s.code === code);
}
