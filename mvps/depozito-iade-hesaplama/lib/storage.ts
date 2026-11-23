import type { MoveOut } from "./deposit";

export const STORAGE_KEY = "deposit-tracker:v1";

export function loadRecords(storage: Pick<Storage, "getItem"> | undefined): MoveOut[] {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isMoveOut) : [];
  } catch {
    return [];
  }
}

export function saveRecords(storage: Pick<Storage, "setItem"> | undefined, records: MoveOut[]): boolean {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}

function isMoveOut(x: unknown): x is MoveOut {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.tenantName === "string" &&
    typeof r.deposit === "number" &&
    typeof r.moveOutDate === "string" &&
    typeof r.stateCode === "string" &&
    Array.isArray(r.deductions)
  );
}
