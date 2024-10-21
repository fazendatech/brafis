/**
 * @description Falha ao fazer uma requisição de serviço.
 */
export class NfeServiceRequestError extends Error {
  public readonly xml: string;
  public readonly error: Error;

  constructor(error: Error, extra: { url: string; xml: string }) {
    super(`${error.message} URL: ${extra.url}`);
    this.name = "NfeServiceRequestError";
    this.stack = error.stack;
    this.error = error;
    this.xml = extra.xml;
  }
}
