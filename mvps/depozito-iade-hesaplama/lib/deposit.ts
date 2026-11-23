import { findState } from "./states";

export type Deduction = {
  id: string;
  description: string;
  category: DeductionCategory;
  amount: number;
};

export const CATEGORIES = ["cleaning", "damage", "unpaid rent", "utilities", "other"] as const;
export type DeductionCategory = (typeof CATEGORIES)[number];

export type MoveOut = {
  id: string;
  tenantName: string;
  propertyAddress: string;
  deposit: number;
  moveOutDate: string; // YYYY-MM-DD
  stateCode: string;
  interest: number;
  deductions: Deduction[];
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

function toUtc(iso: string): number {
  if (!ISO.test(iso)) throw new Error(`Invalid date: ${iso}`);
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
  return new Date(toUtc(iso) + days * 86_400_000).toISOString().slice(0, 10);
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((toUtc(toIso) - toUtc(fromIso)) / 86_400_000);
}

/** Today's date in the viewer's local time zone, as YYYY-MM-DD. */
export function localToday(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function deadlineDays(stateCode: string, hasDeductions: boolean): number | null {
  const s = findState(stateCode);
  if (!s) return null;
  if (!hasDeductions && s.daysNoDeductions !== undefined) return s.daysNoDeductions;
  return s.days;
}

export function computeDeadline(stateCode: string, moveOutDate: string, hasDeductions = true): string | null {
  const days = deadlineDays(stateCode, hasDeductions);
  if (days === null || !ISO.test(moveOutDate)) return null;
  return addDays(moveOutDate, days);
}

const cents = (n: number) => Math.round((Number.isFinite(n) ? n : 0) * 100);

export type Totals = { totalDeductions: number; refund: number; owedByTenant: number };

export function computeTotals(deposit: number, deductions: Pick<Deduction, "amount">[], interest = 0): Totals {
  const ded = deductions.reduce((sum, d) => sum + Math.max(0, cents(d.amount)), 0);
  const balance = Math.max(0, cents(deposit)) + Math.max(0, cents(interest)) - ded;
  return {
    totalDeductions: ded / 100,
    refund: Math.max(0, balance) / 100,
    owedByTenant: Math.max(0, -balance) / 100,
  };
}

export type DeadlineStatus = "overdue" | "soon" | "ok";

export const SOON_DAYS = 3;

export function deadlineStatus(deadline: string, today: string): DeadlineStatus {
  const left = daysBetween(today, deadline);
  if (left < 0) return "overdue";
  if (left <= SOON_DAYS) return "soon";
  return "ok";
}

export function recordDeadline(r: MoveOut): string | null {
  return computeDeadline(r.stateCode, r.moveOutDate, r.deductions.length > 0);
}

/** Records sorted by deadline, earliest first; records without a valid deadline go last. */
export function sortByDeadline(records: MoveOut[]): MoveOut[] {
  return [...records].sort((a, b) => {
    const da = recordDeadline(a);
    const db = recordDeadline(b);
    if (da === db) return a.tenantName.localeCompare(b.tenantName);
    if (da === null) return 1;
    if (db === null) return -1;
    return da < db ? -1 : 1;
  });
}

export function formatMoney(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatDate(iso: string): string {
  return new Date(toUtc(iso)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
