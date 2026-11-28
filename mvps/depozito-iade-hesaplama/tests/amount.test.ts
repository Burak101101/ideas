import { describe, expect, it } from "vitest";
import { parseAmount } from "../lib/deposit";

describe("parseAmount", () => {
  it("treats an empty field as missing, not as an error", () => {
    expect(parseAmount("")).toEqual({ value: 0, error: null, empty: true });
    expect(parseAmount("   ")).toEqual({ value: 0, error: null, empty: true });
  });
  it("accepts zero and positive amounts, rounded to cents", () => {
    expect(parseAmount("0")).toEqual({ value: 0, error: null, empty: false });
    expect(parseAmount("1500")).toEqual({ value: 1500, error: null, empty: false });
    expect(parseAmount("12.345").value).toBe(12.35);
  });
  it("rejects negative amounts", () => {
    expect(parseAmount("-500").error).toMatch(/negative/i);
    expect(parseAmount("-0.01").error).toMatch(/negative/i);
  });
  it("rejects non-numbers and amounts too large to be real", () => {
    expect(parseAmount("abc").error).toMatch(/number/i);
    expect(parseAmount("1e400").error).toMatch(/too large/i);
    expect(parseAmount("100000000").error).toMatch(/too large/i);
    expect(parseAmount("99999999").error).toBeNull();
  });
  it("accepts dollar signs and thousands separators", () => {
    expect(parseAmount("$1,500.50").value).toBe(1500.5);
    expect(parseAmount(" $ 200 ").value).toBe(200);
  });
});
