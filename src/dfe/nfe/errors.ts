import type { GetWebServiceUrlOptions } from "./types.d.ts";

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
  constructor(error: Error, extra: { url: string; xml: string }) {
    super(`${error.message} URL: ${extra.url}`);
    this.name = `ServiceRequestError - ${error.name}`;
    this.stack = error.stack;
    this.xml = extra.xml;
  }
}
