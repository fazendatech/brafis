export function errorHasMessage(e: unknown, message: string): e is Error {
  return e instanceof Error && e.message === message;
}

export class TimeoutError extends Error {
  constructor() {
    super("The operation timed out.");
    this.name = "TimeoutError";
  }
}
