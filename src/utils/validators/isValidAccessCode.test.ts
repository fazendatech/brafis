import { describe, test, expect } from "bun:test";

import { isValidAccessCode } from "./isValidAccessCode";

describe("isValidAccessCode", () => {
  const validAccessCode =
    "1457 9158 7644 3103 8505 9627 0014 0061 8549 8112 272-6";
  const invalidAccessCode = "14579158764431038505962700140061854981122728";

  const validAccessCodeWithChars =
    "[a?@]_14579158764431038505962700140061854981122726";
  const invalidAccessCodeWithChars =
    "[a?@]_14579158764431038505962700140061854981122728";

  test("Returns true when access code is valid", () => {
    expect(isValidAccessCode(validAccessCode)).toBeTrue();
  });

  test("Returns false when access code is invalid", () => {
    expect(isValidAccessCode(invalidAccessCode)).toBeFalse();
  });

  describe("Handles strict option", () => {
    test("Returns true when strict is false", () => {
      expect(
        isValidAccessCode(validAccessCodeWithChars, {
          strict: false,
        }),
      ).toBeTrue();
    });

    test("Returns false when strict is false", () => {
      expect(
        isValidAccessCode(invalidAccessCodeWithChars, { strict: false }),
      ).toBeFalse();
    });

    test("Returns true when strict is true", () => {
      expect(isValidAccessCode(validAccessCode, { strict: true })).toBeTrue();
    });

    test("Returns false when strict is true", () => {
      expect(
        isValidAccessCode(validAccessCodeWithChars, { strict: true }),
      ).toBeFalse();
    });
  });
});
