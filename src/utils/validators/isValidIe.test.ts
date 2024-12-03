import { describe, expect, test } from "bun:test";
import { isValidIe } from "./isValidIe";

describe("isValidIe", () => {
  test("returns true for valid IE with length between 8 and 14", () => {
    expect(isValidIe("12345678")).toBeTrue();
    expect(isValidIe("12345678901234")).toBeTrue();
  });

  test("returns false for IE with length less than 8 or greater than 14", () => {
    expect(isValidIe("1234567")).toBeFalse();
    expect(isValidIe("123456789012345")).toBeFalse();
  });

  test("Handles `strict` option", () => {
    expect(isValidIe("[a?@] 12.345.678-9", { strict: false })).toBeTrue();
    expect(isValidIe("12.345.678-9", { strict: true })).toBeTrue();
    expect(isValidIe("[a?@] 12.345.678-9", { strict: true })).toBeFalse();
  });
});
