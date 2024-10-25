export function errorHasMessage(
  error: unknown,
  message: string,
): error is Error {
  return error instanceof Error && error.message === message;
}

/**
 * @description Wrapper para o erro de timeout interno (`DOMException.TimeoutError`). Útil para facilitar o uso de `catch`.
 */
export class TimeoutError extends Error {
  constructor() {
    super("The operation timed out.");
    this.name = "TimeoutError";
  }
}
