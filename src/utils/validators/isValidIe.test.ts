import { describe, expect, test } from "bun:test";
import { isValidIe } from "./isValidIe";

describe("isValidIe", () => {
  const validIe = "1234567-8";
  const invalidIe = "1234.5678.9012.3456";

  const validIeWithChars = "[a?@] 1234567-8";
  const invalidIeWithChars = "[a?@] 1234.5678.9012-3456";

  test("Returns true for a valid IE", () => {
    expect(isValidIe(validIe)).toBeTrue();
  });

  test("Returns false for an invalid IE", () => {
    expect(isValidIe(invalidIe)).toBeFalse();
  });

  test("Handles strict option", () => {
    test("Returns true when strict is false", () => {
      expect(isValidIe(validIeWithChars, { strict: false })).toBeTrue();
    });

    test("Returns false when strict is false", () => {
      expect(isValidIe(invalidIeWithChars, { strict: false })).toBeFalse();
    });

    test("Returns true when strict is true", () => {
      expect(isValidIe(validIe, { strict: true })).toBeTrue();
    });

    test("Returns false when strict is true", () => {
      expect(isValidIe(validIeWithChars, { strict: true })).toBeFalse();
    });
  });
});
