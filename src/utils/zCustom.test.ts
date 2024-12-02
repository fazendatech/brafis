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
      test("validates only one value is present", () => {
        expect(
          zCustom.utils.hasOnlyOne(null, undefined, "", false, 0, "value"),
        ).toBeTrue();
        expect(
          zCustom.utils.hasOnlyOne(null, undefined, "", false, 0, 1),
        ).toBeTrue();
        expect(
          zCustom.utils.hasOnlyOne(
            null,
            undefined,
            "",
            false,
            "value",
            "another",
          ),
        ).toBeFalse();
        expect(
          zCustom.utils.hasOnlyOne(null, undefined, "", false, 0),
        ).toBeFalse();
        expect(zCustom.utils.hasOnlyOne("value")).toBeTrue();
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
});
