export function errorHasMessage(e: unknown, message: string): e is Error {
  return (e as Error).message === message;
}
