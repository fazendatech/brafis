import type { GetWebServiceUrlOptions } from "./types";

/**
 * @description Não foi localizado a url do web service.
 */
export class NfeWebServiceNotFoundError extends Error {
  constructor({ service, uf, env, contingency }: GetWebServiceUrlOptions) {
    super(
      `Web service not found for ${service}/${uf} (${env}${contingency ? ", em contingência" : ""})`,
    );
    this.name = "NfeWebServiceNotFoundError";
  }
}
