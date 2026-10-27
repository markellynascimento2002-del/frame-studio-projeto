import { describe, expect, it } from "vitest";
import { generateOtp, hashOtp, safeHashEquals } from "./security";

process.env.APP_SECRET = "test-secret-for-unit-tests";

describe("OTP helpers", () => {
  it("gera um código de exatamente seis dígitos", () => {
    expect(generateOtp()).toMatch(/^\d{6}$/);
  });
  it("faz hash estável e permite comparar o hash", () => {
    const hash = hashOtp("123456");
    expect(hashOtp("123456")).toBe(hash);
    expect(safeHashEquals(hash, hashOtp("123456"))).toBe(true);
    expect(safeHashEquals(hash, hashOtp("000000"))).toBe(false);
  });
});
