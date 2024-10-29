import { describe, test, expect } from "bun:test";

import { isValidCnpj } from "./isValidCnpj";

describe("isValidCnpj", () => {
  test("Returns true for a valid CNPJ", () => {
    expect(isValidCnpj("00023456000177")).toBe(true);
  });

  test("Returns false for an invalid CNPJ", () => {
    expect(isValidCnpj("11223344556677")).toBe(false);
  });

  test.todo("Handles `strict` option");
});
