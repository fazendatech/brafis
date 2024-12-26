import { describe, expect, test } from "bun:test";
import { schemaNfeRequestOptions } from "./common";
import { ZodError } from "zod";

describe("common", () => {
  describe("schemaNfeRequestOptions", () => {
    const validOptions = {
      body: {},
      timeout: 1000,
    };
    test("Returns true for a valid object without sign", () => {
      expect(
        schemaNfeRequestOptions.safeParse(validOptions).success,
      ).toBeTrue();
    });
    test("Returns true for a valid object with sign containing xpath", () => {
      expect(
        schemaNfeRequestOptions.safeParse({
          ...validOptions,
          sign: { xpath: "test" },
        }).success,
      ).toBeTrue();
    });
    test("Returns true for a valid object with sign containing id", () => {
      expect(
        schemaNfeRequestOptions.safeParse({
          ...validOptions,
          sign: { id: "test" },
        }).success,
      ).toBeTrue();
    });
    test("Throws error for an invalid object containing both sign options", () => {
      expect(() =>
        schemaNfeRequestOptions.parse({
          ...validOptions,
          sign: { xpath: "test", id: "test" },
        }),
      ).toThrow(ZodError);
    });
  });
});
