import { describe, expect, it } from "vitest";
import { loadLandlord, loadRecords, saveLandlord, STORAGE_KEY } from "../lib/storage";

function memory() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
}

const good = {
  id: "1",
  tenantName: "A",
  propertyAddress: "",
  deposit: 100,
  moveOutDate: "2026-11-01",
  stateCode: "CA",
  interest: 0,
  deductions: [{ id: "d", description: "x", category: "cleaning", amount: 10 }],
};

describe("record validation on load", () => {
  it("skips records with a malformed date instead of crashing", () => {
    const s = memory();
    s.setItem(STORAGE_KEY, JSON.stringify([good, { ...good, id: "2", moveOutDate: "11/01/2026" }]));
    expect(loadRecords(s).map((r) => r.id)).toEqual(["1"]);
  });
  it("skips records with negative/non-finite money or bad deductions", () => {
    const s = memory();
    s.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { ...good, id: "neg", deposit: -5 },
        { ...good, id: "int", interest: -1 },
        { ...good, id: "ded", deductions: [{ id: "d", description: "x", amount: "10" }] },
        good,
      ]),
    );
    expect(loadRecords(s).map((r) => r.id)).toEqual(["1"]);
  });
  it("fills in fields added later (forwarding address) for old records", () => {
    const s = memory();
    s.setItem(STORAGE_KEY, JSON.stringify([good]));
    expect(loadRecords(s)[0].forwardingAddress).toBe("");
  });
});

describe("landlord details", () => {
  it("round-trips and defaults to empty", () => {
    const s = memory();
    expect(loadLandlord(s)).toEqual({ name: "", address: "" });
    saveLandlord(s, { name: "Pat Lee", address: "1 Main St" });
    expect(loadLandlord(s)).toEqual({ name: "Pat Lee", address: "1 Main St" });
  });
  it("ignores corrupt data", () => {
    const s = memory();
    s.setItem("deposit-tracker:landlord", "{bad");
    expect(loadLandlord(s)).toEqual({ name: "", address: "" });
    expect(loadLandlord(undefined)).toEqual({ name: "", address: "" });
  });
});
