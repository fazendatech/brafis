import { describe, test, expect } from "bun:test";

import { isValidAccessCode } from "./isValidAccessCode";

describe("isValidAccessCode", () => {
  const validAccessCode =
    "3219 1105 5707-1400-0825.5500.1005.9146-6211-3308 2968";
  const invalidAccessCode = "32191105570714000825550010059146621133082960";
  const invalidAccessCodeWithSpecialChars =
    "[a?@]_32191105570714000825550010059146621133082960";
  const accessCodeWithSpecialChars =
    "[a?@]_32191105570714000825550010059146621133082968";

  test("Returns true when access code is valid", () => {
    expect(isValidAccessCode(validAccessCode)).toBeTrue();
  });

  test("Returns false when access code is invalid", () => {
    expect(isValidAccessCode(invalidAccessCode)).toBeFalse();
  });

  describe("Handles strict option", () => {
    test("Returns true when strict is false", () => {
      expect(
        isValidAccessCode(accessCodeWithSpecialChars, {
          strict: false,
        }),
      ).toBeTrue();
    });
    test("Returns false when strict is false", () => {
      expect(
        isValidAccessCode(invalidAccessCodeWithSpecialChars, { strict: false }),
      ).toBeFalse();
    });
    test("Returns true when strict is true", () => {
      expect(isValidAccessCode(validAccessCode, { strict: true })).toBeTrue();
    });
    test("Returns false when strict is true", () => {
      expect(
        isValidAccessCode(accessCodeWithSpecialChars, { strict: true }),
      ).toBeFalse();
    });
  });
});
