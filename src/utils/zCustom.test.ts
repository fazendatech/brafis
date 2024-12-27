import { describe, test, expect } from "bun:test";
import { zCustom } from "./zCustom";

describe("zCustom", () => {
  describe("numeric", () => {
    const zNumeric = zCustom.numeric();

    test("Successfully parses valid numeric string", () => {
      expect(zNumeric.safeParse("123").success).toBeTrue();
    });

    test("Fails when parsing invalid numeric string", () => {
      expect(zNumeric.safeParse("1.2").success).toBeFalse();
    });
  });

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
  });

  describe("date", () => {
    const zDate = zCustom.date();

    test("Successfully parses valid date string", () => {
      expect(zDate.safeParse("2020-01-01T00:00:00-03:00").success).toBeTrue();
    });

    test("Fails when parsing invalid date string", () => {
      expect(zDate.safeParse("2021-10-10").success).toBeFalse();
      expect(zDate.safeParse("2021-10-10 00:00:00").success).toBeFalse();
      expect(zDate.safeParse("2021-10-10T00:00:00.000").success).toBeFalse();
    });
  });

  describe("placa", () => {
    test("Successfully parses valid placa string", () => {
      expect(zCustom.placa().safeParse("AB1234").success).toBeTrue();
      expect(zCustom.placa().safeParse("ABC123").success).toBeTrue();
      expect(zCustom.placa().safeParse("ABC1234").success).toBeTrue();
      expect(zCustom.placa().safeParse("ABCD123").success).toBeTrue();
    });

    test("Fails when parsing invalid placa string", () => {
      expect(zCustom.placa().safeParse("ABC-123").success).toBeFalse();
      expect(zCustom.placa().safeParse("ABCDE123").success).toBeFalse();
      expect(zCustom.placa().safeParse("A12345").success).toBeFalse();
    });
  });

  describe("utils", () => {
    describe("hasOnlyOne", () => {
      test("Returns true when only one value is valid", () => {
        expect(zCustom.utils.hasOnlyOne(0)).toBeTrue();
        expect(zCustom.utils.hasOnlyOne(false)).toBeTrue();
        expect(zCustom.utils.hasOnlyOne("")).toBeTrue();
        expect(zCustom.utils.hasOnlyOne("value")).toBeTrue();
        expect(zCustom.utils.hasOnlyOne(null, undefined, "value")).toBeTrue();
      });

      test("Returns false when multiple values are valid", () => {
        expect(zCustom.utils.hasOnlyOne("value", 1)).toBeFalse();
      });
    });

    describe("hasAllOrNothing", () => {
      test("Returns true when all values are present", () => {
        expect(zCustom.utils.hasAllOrNothing("value", "value")).toBeTrue();
        expect(zCustom.utils.hasAllOrNothing("value", "", false, 0)).toBeTrue();
      });

      test("Returns true when no values are present", () => {
        expect(zCustom.utils.hasAllOrNothing(null, undefined)).toBeTrue();
      });

      test("Returns false when some values are present", () => {
        expect(zCustom.utils.hasAllOrNothing("value", undefined)).toBeFalse();
      });
    });
  });
});
