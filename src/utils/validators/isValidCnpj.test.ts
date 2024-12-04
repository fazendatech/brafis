import { describe, test, expect } from "bun:test";

import { isValidCnpj } from "./isValidCnpj";

describe("isValidCnpj", () => {
  const validCnpj = "00023456000177";
  const invalidCnpj = "11223344556677";
  const validCnpjWithChars = "[a?@] 00.023.456/0001-77";
  const invalidCnpjWithChars = "[a?@] 11.223.344/5566-77";

  test("Returns true for a valid CNPJ", () => {
    expect(isValidCnpj(validCnpj)).toBeTrue();
  });

  test("Returns false for an invalid CNPJ", () => {
    expect(isValidCnpj(invalidCnpj)).toBeFalse();
  });

  describe("Handles `strict` option", () => {
    test("Returns true when strict is false", () => {
      expect(isValidCnpj(validCnpjWithChars, { strict: false })).toBeTrue();
    });
    test("Returns false when strict is false", () => {
      expect(isValidCnpj(invalidCnpjWithChars, { strict: false })).toBeFalse();
    });
    test("Returns true when strict is true", () => {
      expect(isValidCnpj(validCnpj, { strict: true })).toBe(true);
    });
    test("Returns false when strict is true", () => {
      expect(isValidCnpj(validCnpjWithChars, { strict: true })).toBe(false);
    });
  });
  //   expect(
  //     isValidCnpj("[a?@] 00.023.456/0001-77", { strict: false }),
  //   ).toBeTrue();
  //   expect(isValidCnpj("00.023.456/0001-77", { strict: true })).toBeTrue();
  //   expect(
  //     isValidCnpj("[a?@] 00.023.456/0001-77", { strict: true }),
  //   ).toBeFalse();
  // });
});
