import { describe, expect, test } from "bun:test";
import { errorHasMessage } from ".";

describe("errorHasMessage", () => {
  test("Returns true if the error has the expected message", () => {
    const error = new Error("Error message");
    const message = "Error message";

    const result = errorHasMessage(error, message);

    expect(result).toBeTrue();
  });

  test("Returns false if the error has a different message", () => {
    const error = new Error("Error message");
    const message = "Another error message";

    const result = errorHasMessage(error, message);

    expect(result).toBeFalse();
  });

  test("Returns false if the error is not an instance of Error", () => {
    const error = "Error message";
    const message = "Error message";

    const result = errorHasMessage(error, message);

    expect(result).toBeFalse();
  });
});
