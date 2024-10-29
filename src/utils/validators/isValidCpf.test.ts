import { describe, test, expect } from "bun:test";

import { isValidCpf } from "./isValidCpf";

describe("isValidCpf", () => {
  test("Returns true for a valid CPF", () => {
    expect(isValidCpf("11155599900")).toBe(true);
  });

  test("Returns false for an invalid CPF", () => {
    expect(isValidCpf("11223344556")).toBe(false);
  });

  test.todo("Handles `strict` option");
});
