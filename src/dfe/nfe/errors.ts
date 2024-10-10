import type { UF, Environment, WebService } from "./types.ts";
export class WebServiceNotFoundError extends Error {
  constructor({
    uf,
    service,
    env,
    contingencia,
  }: { uf: UF; service: WebService; env: Environment; contingencia: boolean }) {
    super(
      `Web service not found for ${service}/${uf} (${env}, contingencia: ${contingencia})`,
    );
    this.name = "WebServiceNotFoundError";
  }
}

export class NfeStatusServiceError extends Error {
  constructor() {
    super("Unable to get status from the response");
    this.name = "NfeStatusServiceError";
  }
}

export class ServiceRequestError extends Error {
  constructor(error: Error, url: string, xml: string) {
    super(
      `Original Error: ${error.message}\nResquest to ${url} failed with XML:\n${xml.length > 100 ? `${xml.substring(0, 100)}...` : xml}`,
    );
    this.name = "ServiceRequestError";
  }
}
