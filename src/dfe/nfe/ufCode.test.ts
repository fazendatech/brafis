import { describe, test, expect } from "bun:test";
import { getUfCode, getUfFromCode } from "@/dfe/nfe/ufCode";
import type { UF } from "@/dfe/nfe/types";

describe("getUfCode", () => {
  test("Return the correct code for a valid UF", () => {
    const testCases: Record<UF, number> = {
      AC: 12,
      AL: 27,
      AP: 16,
      AM: 13,
      BA: 29,
      CE: 23,
      DF: 53,
      ES: 32,
      GO: 52,
      MA: 21,
      MT: 51,
      MS: 50,
      MG: 31,
      PA: 15,
      PB: 25,
      PR: 41,
      PE: 26,
      PI: 22,
      RJ: 33,
      RN: 24,
      RS: 43,
      RO: 11,
      RR: 14,
      SC: 42,
      SP: 35,
      SE: 28,
      TO: 17,
    };

    for (const [uf, code] of Object.entries(testCases)) {
      expect(getUfCode(uf as UF)).toBe(code);
    }
  });

  test("Return undefined for an invalid UF", () => {
    expect(getUfCode("XX" as UF)).toBeUndefined();
  });
});

describe("getUfFromCode", () => {
  test("Return the correct UF for a valid code", () => {
    for (const [uf, code] of Object.entries({
      AC: 12,
      AL: 27,
      AP: 16,
      AM: 13,
      BA: 29,
      CE: 23,
      DF: 53,
      ES: 32,
      GO: 52,
      MA: 21,
      MT: 51,
      MS: 50,
      MG: 31,
      PA: 15,
      PB: 25,
      PR: 41,
      PE: 26,
      PI: 22,
      RJ: 33,
      RN: 24,
      RS: 43,
      RO: 11,
      RR: 14,
      SC: 42,
      SP: 35,
      SE: 28,
      TO: 17,
    })) {
      expect(getUfFromCode(code)).toBe(uf as UF);
    }
  });

  test("Return undefined for an invalid code", () => {
    expect(getUfFromCode(99)).toBeUndefined();
  });
});
