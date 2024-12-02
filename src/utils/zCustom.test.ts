import { describe, test, expect } from "bun:test";
import { zCustom } from "./zCustom";

describe("zCustom", () => {
  describe("decimal", () => {
    const zDecimal = zCustom.decimal(2, 2);
    test("validates a decimal number", () => {
      expect(zDecimal.safeParse("1").success).toBeTrue();
      expect(zDecimal.safeParse("1.2").success).toBeTrue();
      expect(zDecimal.safeParse("1.23").success).toBeTrue();
    });
    test("throws error when invalid", () => {
      expect(zDecimal.safeParse("1.").success).toBeFalse();
      expect(zDecimal.safeParse("123.1").success).toBeFalse();
      expect(zDecimal.safeParse("1.234").success).toBeFalse();
      expect(zDecimal.safeParse("1,23").success).toBeFalse();
    });
  });
  describe("utils", () => {
    describe("hasOnlyOne", () => {
      test.todo("validates only one value is present");
    });
    describe("hasAllOrNothing", () => {
      test.todo("validates either all values are present or none");
    });
  });
});
