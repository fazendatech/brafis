/**
 * @description Não foi localizado a url do webservice.
 */
export class WebServiceNotFoundError extends Error {
  constructor() {
    super("Web service not found");
    this.name = "WebServiceNotFoundError";
  }
}

/**
 * @description Especificar a UF para obter a URL do webservice.
 */
export class WebServiceUfError extends Error {
  constructor() {
    super("Specify the UF to get the web service URL");
    this.name = "WebServiceUfError";
  }
}

/**
 * @description Tempo limite de uma requisição a um serviço foi excedido.
 */
export class ServiceRequestTimeoutError extends Error {
  constructor() {
    super("Request timed out");
    this.name = "ServiceRequestTimeoutError";
  }
}

/**
 * @description Falha ao fazer uma requisição de serviço.
 */
export class ServiceRequestError extends Error {
  constructor(error: Error, url: string, xml: string) {
    super(
      `Original Error: ${error.message}\nResquest to ${url} failed with XML:\n${xml.length > 100 ? `${xml.substring(0, 100)}...` : xml}`,
    );
    this.name = "ServiceRequestError";
  }
}

/**
 * @description Falha ao obter o status a partir da resposta do servidor.
 */
export class NfeStatusServicoError extends Error {
  constructor() {
    super("Unable to get status from the server's response");
    this.name = "NfeStatusServiceError";
  }
}

/**
 * @description Falha ao consultar cadastro partir da resposta do servidor.
 */
export class NfeConsultaCadastroError extends Error {
  constructor() {
    super("Unable to get register info from the server's response");
    this.name = "NfeConsultaCadastroError";
  }
}
