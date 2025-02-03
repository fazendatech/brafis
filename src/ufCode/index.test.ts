import { describe, expect, test } from "bun:test";
import { getUfCode, getUfFromCode } from ".";

describe("getUfCode", () => {
  test("Returns the UF Code for a valid UF", () => {
    expect(getUfCode("GO")).toBe("52");
  });
});

describe("getUfFromCode", () => {
  test("Returns the correct UF for a valid code", () => {
    expect(getUfFromCode("52")).toBe("GO");
  });
});
