import { describe, expect, it } from "vitest";
import { loadRecords, saveRecords, STORAGE_KEY } from "../lib/storage";

function memory() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
  };
}

describe("storage", () => {
  it("round-trips records", () => {
    const s = memory();
    const rec = {
      id: "1",
      tenantName: "A",
      propertyAddress: "",
      deposit: 1,
      moveOutDate: "2026-11-01",
      stateCode: "CA",
      interest: 0,
      deductions: [],
      forwardingAddress: "",
    };
    expect(saveRecords(s, [rec])).toBe(true);
    expect(loadRecords(s)).toEqual([rec]);
  });
  it("returns [] for missing, corrupt or wrong-shaped data", () => {
    const s = memory();
    expect(loadRecords(s)).toEqual([]);
    s.setItem(STORAGE_KEY, "{not json");
    expect(loadRecords(s)).toEqual([]);
    s.setItem(STORAGE_KEY, JSON.stringify([{ id: 1 }]));
    expect(loadRecords(s)).toEqual([]);
    expect(loadRecords(undefined)).toEqual([]);
  });
  it("reports failure when storage throws", () => {
    const s = { setItem: () => { throw new Error("quota"); } };
    expect(saveRecords(s, [])).toBe(false);
  });
});
