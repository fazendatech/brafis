import { describe, test, expect } from "bun:test";
import { ZodError } from "zod";
import { validate } from ".";

describe("validate", () => {
  const type = "CPF";
  describe("CPF", () => {
    test("Return true for a valid CPF", () => {
      expect(validate({ type, value: "11155599900" })).toMatchObject({
        valid: true,
        use: "11155599900",
      });
    });
    test("Return false for an invalid CPF", () => {
      expect(validate({ type, value: "11223344556" }).valid).toBe(false);
    });
    test("Return false for a CPF with less than 11 digits", () => {
      expect(validate({ type, value: "123456789" }).valid).toBe(false);
    });
  });

  describe("CNPJ", () => {
    const type = "CNPJ";
    test("Return true for a valid CNPJ", () => {
      const response = validate({ type, value: "00.023.456/0001-77" });
      expect(response).toMatchObject({ valid: true, use: "23456000177" });
    });
    test("Return false for an invalid CPF", () => {
      expect(validate({ type, value: "11223344556677" }).valid).toBe(false);
    });
    test("Return false for a CNPJ with less than 14 digits", () => {
      expect(validate({ type, value: "123456789" }).valid).toBe(false);
    });
  });

  describe("Schema parse", () => {
    test("Throws error because the value lenght", () => {
      expect(() =>
        validate({ type: "CPF", value: "12345600000000000789" }),
      ).toThrowError(ZodError);
    });
  });
});
