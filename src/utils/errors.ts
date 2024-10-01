export function errorHasMessage(e: unknown, message: string): e is Error {
  return e instanceof Error && e.message === message;
}
