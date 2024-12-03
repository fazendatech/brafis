import { describe, test, expect } from "bun:test";
import { zCustom } from "./zCustom";

describe("zCustom", () => {
  describe("decimal", () => {
    const zDecimal = zCustom.decimal(1, 1);

    test("Successfully parses valid decimal number", () => {
      expect(zDecimal.safeParse("1").success).toBeTrue();
      expect(zDecimal.safeParse("1.2").success).toBeTrue();
    });

    test("Fails when parsing invalid decimal number", () => {
      expect(zDecimal.safeParse("1.").success).toBeFalse();
      expect(zDecimal.safeParse("1,2").success).toBeFalse();
      expect(zDecimal.safeParse("12.3").success).toBeFalse();
      expect(zDecimal.safeParse("1.23").success).toBeFalse();
    });

    test("Throws error when before or after is less than 1", () => {
      expect(() => zCustom.decimal(0, 1)).toThrowError();
      expect(() => zCustom.decimal(1, 0)).toThrowError();
      expect(() => zCustom.decimal(-1, 1)).toThrowError();
      expect(() => zCustom.decimal(1, -1)).toThrowError();
    });
  });

  describe("utils", () => {
    describe("hasOnlyOne", () => {
      test("Returns true when only one value is valid", () => {
        expect(zCustom.utils.hasOnlyOne(0)).toBeTrue();
        expect(zCustom.utils.hasOnlyOne(1)).toBeTrue();
        expect(zCustom.utils.hasOnlyOne(false)).toBeTrue();
        expect(zCustom.utils.hasOnlyOne(true)).toBeTrue();
        expect(zCustom.utils.hasOnlyOne("")).toBeTrue();
        expect(zCustom.utils.hasOnlyOne("value")).toBeTrue();
        expect(zCustom.utils.hasOnlyOne(null, undefined, "value")).toBeTrue();
      });
      test("Returns false when multiple values are valid", () => {
        expect(zCustom.utils.hasOnlyOne("value", 1)).toBeFalse();
        expect(zCustom.utils.hasOnlyOne("", false, 0)).toBeFalse();
      });
    });

    describe("hasAllOrNothing", () => {
      test("validates either all values are present or none", () => {
        expect(
          zCustom.utils.hasAllOrNothing(null, undefined, "", false, 0),
        ).toBeTrue();
        expect(
          zCustom.utils.hasAllOrNothing("value1", "value2", "value3"),
        ).toBeTrue();
        expect(
          zCustom.utils.hasAllOrNothing(null, "value", "", false, 0),
        ).toBeFalse();
        expect(
          zCustom.utils.hasAllOrNothing("value", undefined, "another"),
        ).toBeFalse();
        expect(zCustom.utils.hasAllOrNothing()).toBeTrue();
      });
    });
  });
});
