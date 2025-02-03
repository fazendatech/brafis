import { describe, expect, test } from "bun:test";
import { isValidCpf } from "./isValidCpf";

describe("isValidCpf", () => {
  const validCpf = "111.555.999-00";
  const invalidCpf = "112.233.445-56";

  const validCpfWithChars = "[a?@] 111.555.999-00";
  const invalidCpfWithChars = "[a?@] 112.233.445-56";

  test("Returns true for a valid CPF", () => {
    expect(isValidCpf(validCpf)).toBeTrue();
  });

  test("Returns false for an invalid CPF", () => {
    expect(isValidCpf(invalidCpf)).toBeFalse();
  });

  test("Handles strict option", () => {
    test("Returns true when strict is false", () => {
      expect(isValidCpf(validCpfWithChars, { strict: false })).toBeTrue();
    });

    test("Returns false when strict is false", () => {
      expect(isValidCpf(invalidCpfWithChars, { strict: false })).toBeFalse();
    });

    test("Returns true when strict is true", () => {
      expect(isValidCpf(validCpf, { strict: true })).toBeTrue();
    });

    test("Returns false when strict is true", () => {
      expect(isValidCpf(validCpfWithChars, { strict: true })).toBeFalse();
    });
  });
});
