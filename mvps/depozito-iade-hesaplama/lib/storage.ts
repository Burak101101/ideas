import { CATEGORIES, isIsoDate, MAX_AMOUNT, type MoveOut } from "./deposit";

export const STORAGE_KEY = "deposit-tracker:v1";
export const LANDLORD_KEY = "deposit-tracker:landlord";

export type Landlord = { name: string; address: string };

export function loadRecords(storage: Pick<Storage, "getItem"> | undefined): MoveOut[] {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(isMoveOut).map((r) => ({
          ...r,
          interest: typeof r.interest === "number" ? r.interest : 0,
          propertyAddress: typeof r.propertyAddress === "string" ? r.propertyAddress : "",
          forwardingAddress: typeof r.forwardingAddress === "string" ? r.forwardingAddress : "",
        }))
      : [];
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

export function loadLandlord(storage: Pick<Storage, "getItem"> | undefined): Landlord {
  try {
    const p = JSON.parse(storage?.getItem(LANDLORD_KEY) ?? "null");
    return {
      name: typeof p?.name === "string" ? p.name : "",
      address: typeof p?.address === "string" ? p.address : "",
    };
  } catch {
    return { name: "", address: "" };
  }
}

export function saveLandlord(storage: Pick<Storage, "setItem"> | undefined, l: Landlord): boolean {
  try {
    storage?.setItem(LANDLORD_KEY, JSON.stringify(l));
    return true;
  } catch {
    return false;
  }
}

const money = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= MAX_AMOUNT;

function isDeduction(x: unknown): boolean {
  if (!x || typeof x !== "object") return false;
  const d = x as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    typeof d.description === "string" &&
    (CATEGORIES as readonly unknown[]).includes(d.category) &&
    money(d.amount)
  );
}

function isMoveOut(x: unknown): x is MoveOut {
  if (!x || typeof x !== "object") return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.tenantName === "string" &&
    money(r.deposit) &&
    (r.interest === undefined || money(r.interest)) &&
    typeof r.moveOutDate === "string" &&
    isIsoDate(r.moveOutDate) &&
    typeof r.stateCode === "string" &&
    Array.isArray(r.deductions) &&
    r.deductions.every(isDeduction)
  );
}
