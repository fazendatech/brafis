import { describe, test, expect } from "bun:test";
import { validateCPF } from ".";

describe("validateCPF", () => {
  test("Return true for a valid CPF", () => {
    expect(validateCPF("11155599900")).toBe(true);
  });
  test("Return false for an invalid CPF", () => {
    expect(validateCPF("11223344556")).toBe(false);
  });
  test("Return false for a CPF with less than 11 digits", () => {
    expect(validateCPF("123456789")).toBe(false);
  });
});
