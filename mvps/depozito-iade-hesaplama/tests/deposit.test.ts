import { describe, expect, it } from "vitest";
import {
  addDays,
  computeDeadline,
  computeTotals,
  daysBetween,
  deadlineStatus,
  localToday,
  sortByDeadline,
  type MoveOut,
} from "../lib/deposit";
import { STATES } from "../lib/states";

describe("dates", () => {
  it("adds calendar days across month boundaries", () => {
    expect(addDays("2026-11-01", 21)).toBe("2026-11-22");
    expect(addDays("2026-12-20", 14)).toBe("2027-01-03");
    expect(addDays("2028-02-20", 10)).toBe("2028-03-01"); // leap year
  });
  it("counts days between dates", () => {
    expect(daysBetween("2026-11-23", "2026-11-26")).toBe(3);
    expect(daysBetween("2026-11-23", "2026-11-20")).toBe(-3);
  });
  it("formats local today", () => {
    expect(localToday(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05");
  });
});

describe("state deadlines", () => {
  it("has at least 10 states, each with an https source", () => {
    expect(STATES.length).toBeGreaterThanOrEqual(10);
    for (const s of STATES) {
      expect(s.sourceUrl).toMatch(/^https:\/\//);
      expect(s.days).toBeGreaterThan(0);
    }
    expect(new Set(STATES.map((s) => s.code)).size).toBe(STATES.length);
  });
  it("California: 21 days from move-out", () => {
    expect(computeDeadline("CA", "2026-11-01")).toBe("2026-11-22");
  });
  it("New York: 14 days", () => {
    expect(computeDeadline("NY", "2026-11-01")).toBe("2026-11-15");
  });
  it("Florida: 15 days without deductions, 30 with", () => {
    expect(computeDeadline("FL", "2026-11-01", false)).toBe("2026-11-16");
    expect(computeDeadline("FL", "2026-11-01", true)).toBe("2026-12-01");
  });
  it("returns null for unknown state or bad date", () => {
    expect(computeDeadline("ZZ", "2026-11-01")).toBeNull();
    expect(computeDeadline("CA", "")).toBeNull();
  });
});

describe("totals", () => {
  it("subtracts deductions from the deposit", () => {
    expect(computeTotals(1500, [{ amount: 200 }, { amount: 150 }])).toEqual({
      totalDeductions: 350,
      refund: 1150,
      owedByTenant: 0,
    });
    expect(computeTotals(1500, [{ amount: 200 }]).refund).toBe(1300);
  });
  it("adds interest to the refund", () => {
    expect(computeTotals(1500, [{ amount: 200 }, { amount: 150 }], 12).refund).toBe(1162);
  });
  it("shows amount owed when deductions exceed the deposit", () => {
    expect(computeTotals(1500, [{ amount: 1800 }])).toEqual({
      totalDeductions: 1800,
      refund: 0,
      owedByTenant: 300,
    });
  });
  it("avoids floating point drift", () => {
    expect(computeTotals(100, [{ amount: 0.1 }, { amount: 0.2 }]).refund).toBe(99.7);
  });
  it("ignores negative and non-numeric amounts", () => {
    expect(computeTotals(100, [{ amount: -50 }, { amount: NaN }]).refund).toBe(100);
  });
});

describe("status and sorting", () => {
  it("labels overdue, soon and ok", () => {
    expect(deadlineStatus("2026-11-22", "2026-11-23")).toBe("overdue");
    expect(deadlineStatus("2026-11-23", "2026-11-23")).toBe("soon");
    expect(deadlineStatus("2026-11-26", "2026-11-23")).toBe("soon");
    expect(deadlineStatus("2026-11-27", "2026-11-23")).toBe("ok");
  });
  it("sorts records by deadline", () => {
    const mk = (id: string, stateCode: string, moveOutDate: string): MoveOut => ({
      id,
      tenantName: id,
      propertyAddress: "",
      deposit: 1000,
      moveOutDate,
      stateCode,
      interest: 0,
      deductions: [],
    });
    const sorted = sortByDeadline([
      mk("va", "VA", "2026-11-01"), // 12-16
      mk("ny", "NY", "2026-11-01"), // 11-15
      mk("bad", "ZZ", "2026-11-01"),
      mk("ca", "CA", "2026-11-01"), // 11-22
    ]);
    expect(sorted.map((r) => r.id)).toEqual(["ny", "ca", "va", "bad"]);
  });
});
