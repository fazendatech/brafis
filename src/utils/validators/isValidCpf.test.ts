import { describe, test, expect } from "bun:test";

import { isValidCpf } from "./isValidCpf";

describe("isValidCpf", () => {
  test("Returns true for a valid CPF", () => {
    expect(isValidCpf("11155599900")).toBe(true);
  });

  test("Returns false for an invalid CPF", () => {
    expect(isValidCpf("11223344556")).toBe(false);
  });

  test("Handles `strict` option", () => {
    expect(isValidCpf("[a?@] 111.555.999-00", { strict: false })).toBeTrue();
    expect(isValidCpf("111.555.999-00", { strict: true })).toBeTrue();
    expect(isValidCpf("[a?@] 111.555.999-00", { strict: true })).toBeFalse();
  });
});
