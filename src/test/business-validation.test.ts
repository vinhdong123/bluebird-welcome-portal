import { describe, expect, it } from "vitest";
import { isValidTaxCode, isValidVnPhone } from "@/lib/business-validation";

describe("isValidTaxCode", () => {
  it("accepts a 10-digit tax code", () => {
    expect(isValidTaxCode("0101234567")).toBe(true);
  });
  it("accepts a 10-digit code with a 3-digit branch suffix", () => {
    expect(isValidTaxCode("0101234567-001")).toBe(true);
  });
  it("rejects a 9-digit code", () => {
    expect(isValidTaxCode("010123456")).toBe(false);
  });
});

describe("isValidVnPhone", () => {
  it("accepts a 10-digit number starting with 09", () => {
    expect(isValidVnPhone("0912 345 678")).toBe(true);
  });
  it("accepts the +84 prefix", () => {
    expect(isValidVnPhone("+84912345678")).toBe(true);
  });
  it("rejects a number with too few digits", () => {
    expect(isValidVnPhone("091234567")).toBe(false);
  });
});
