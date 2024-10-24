import { describe, test, expect } from "bun:test";

import { isValidCnpj, isValidCpf } from ".";

describe("validate", () => {
  describe("isValidCpf", () => {
    test("Return true for a valid CPF", () => {
      expect(isValidCpf("11155599900")).toBe(true);
    });
    test("Return false for an invalid CPF", () => {
      expect(isValidCpf("11223344556")).toBe(false);
    });
  });

  describe("isValidCnpj", () => {
    test("Return true for a valid CNPJ", () => {
      expect(isValidCnpj("00023456000177")).toBe(true);
    });
    test("Return false for an invalid CPF", () => {
      expect(isValidCnpj("11223344556677")).toBe(false);
    });
  });

  describe.todo("isValidIe", () => {
    test.todo(
      "Implementar verdadeiras regras de validação para IE (varia por estado)",
    );
  });
});
