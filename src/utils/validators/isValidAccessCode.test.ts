import { describe, test, expect } from "bun:test";

import { isValidAccessCode } from "./isValidAccessCode";

describe("isValidAccessCode", () => {
  const validAccessCode = "32191105570714000825550010059146621133082968";
  test("valid access codes with lenght 44", () => {
    expect(isValidAccessCode(validAccessCode.slice(0, -1))).toBeFalse(); //43
    expect(isValidAccessCode(validAccessCode)).toBeTrue(); // 44
    expect(isValidAccessCode(`${validAccessCode}0`)).toBeFalse(); //45
  });

  test("return false to access codes with invalid verifier digit", () => {
    expect(isValidAccessCode(`${validAccessCode.slice(0, -1)}0`)).toBeFalse();
  });

  test("Handles `strict` option", () => {
    expect(
      isValidAccessCode(`[a?@]_ ${validAccessCode}`, { strict: false }),
    ).toBeTrue();
    expect(isValidAccessCode(validAccessCode, { strict: true })).toBeTrue();
    expect(
      isValidAccessCode(`[a?@]_ ${validAccessCode}`, { strict: true }),
    ).toBeFalse();
  });
});
