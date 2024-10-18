import type { GetWebServiceUrlOptions } from "@nfe/types";

/**
 * @description Não foi localizado a url do web service.
 */
export class WebServiceNotFoundError extends Error {
  constructor({ service, uf, env, contingency }: GetWebServiceUrlOptions) {
    super(
      `Web service not found for ${service}/${uf} (${env}${contingency ? ", em contingência" : ""})`,
    );
    this.name = "WebServiceNotFoundError";
  }
}

/**
 * @description Falha ao fazer uma requisição de serviço.
 */
export class ServiceRequestError extends Error {
  public readonly xml: string;
  public readonly error: Error;

  constructor(error: Error, extra: { url: string; xml: string }) {
    super(`${error.message} URL: ${extra.url}`);
    this.name = "ServiceRequestError";
    this.stack = error.stack;
    this.error = error;
    this.xml = extra.xml;
  }
}
