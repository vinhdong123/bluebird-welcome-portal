import { describe, expect, it } from "vitest";
import { getPasswordStrength } from "@/lib/password-strength";

describe("getPasswordStrength", () => {
  it("returns 0 for an empty password", () => {
    expect(getPasswordStrength("")).toBe(0);
  });
  it("gives full score when all four criteria are met", () => {
    expect(getPasswordStrength("Abcdef1!")).toBe(4);
  });
  it("does not count length under 8 characters", () => {
    expect(getPasswordStrength("Ab1!")).toBe(3);
  });
});
