import { describe, test, expect } from "bun:test";
import { validateCNPJ } from ".";

describe("validateCNPJ", () => {
  test("Return true for a valid CNPJ", () => {
    const response = validateCNPJ("00.023.456/0001-77");
    expect(response).toMatchObject({ valid: true, use: "23456000177" });
  });
  test("Return false for an invalid CPF", () => {
    expect(validateCNPJ("11223344556677").valid).toBe(false);
  });
  test("Return false for a CNPJ with less than 14 digits", () => {
    expect(validateCNPJ("123456789").valid).toBe(false);
  });
});
