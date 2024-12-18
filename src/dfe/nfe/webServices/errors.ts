/**
 * @description Falha ao fazer uma requisição de serviço.
 */
export class NfeServiceRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NfeServiceRequestError";
  }
}
