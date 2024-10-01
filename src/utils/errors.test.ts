import { describe, test, expect } from "bun:test";
import { errorHasMessage } from "@/utils";

describe("errorHasMessage", () => {
  test("should return true if the error has the expected message", () => {
    const error = new Error("Error message");
    const message = "Error message";

    const result = errorHasMessage(error, message);

    expect(result).toBe(true);
  });

  test("should return false if the error has a different message", () => {
    const error = new Error("Error message");
    const message = "Another error message";

    const result = errorHasMessage(error, message);

    expect(result).toBe(false);
  });
});
