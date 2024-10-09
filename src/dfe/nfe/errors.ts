import type { UF, Environment, WebService } from "./types.js";
export class WebServiceNotFoundError extends Error {
  constructor(
    uf: UF,
    service: WebService,
    env: Environment,
    contingencia: boolean,
  ) {
    super(
      `Web service not found for ${service}/${uf} (${env}, contingencia: ${contingencia})`,
    );
    this.name = "WebServiceNotFoundError";
  }
}
