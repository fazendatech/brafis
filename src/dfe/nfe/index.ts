import type { CertificateP12 } from "@/certificate";
import type {
  Environment,
  NfeRequestOptions,
  NfeStatusServicoRaw,
  NfeStatusServicoResponse,
  NfeConsultaCadastroOptions,
  NfeConsultaCadastroRaw,
  NfeConsultaCadastroResponse,
  UF,
  UFCode,
  WebService,
} from "@/dfe/nfe/types";
import { buildSoap, fetchWithTls, parseSoap, type XMLNamespace } from "@/utils";
import { getWebServiceUrl } from "./webServiceUrls.ts";
import { loadNfeCa } from "./ca.ts";
import { getUfCode } from "./ufCode.ts";
import { ServiceRequestError } from "./errors.ts";
import { getInfoStatus } from "./infoStatus.ts";

/**
 * @description Opções do "NfeWebServices".
 *
 * @property {UF} uf - A unidade federativa (estado) para a NF-e.
 * @property {Environment} env - `producao` -> `tpAmb = 1`. `homologacao` -> `tpAmb = 2`.
 * @property {CertificateP12} certificate - O certificado P12 para autenticação.
 * @property {boolean} [contingency] - Habilitar uso do servidor de contingência.
 * @property {number} [timeout] - Timeout da requisição em ms, padrão 15000ms.
 */
export interface NfeWebServicesOptions {
  uf: UF;
  env: Environment;
  certificate: CertificateP12;
  contingency?: boolean;
  timeout?: number;
}

export class NfeWebServices {
  private uf: UF;
  private env: Environment;
  private certificate: CertificateP12;
  private contingency: boolean;
  private timeout: number;
  private ca: string;
  private tpAmb: "1" | "2";
  private cUF: UFCode;
  private xmlNamespace: XMLNamespace;

  constructor(options: NfeWebServicesOptions) {
    this.uf = options.uf;
    this.env = options.env;
    this.certificate = options.certificate;
    this.contingency = options.contingency ?? false;
    this.timeout = options.timeout ?? 15000;
    this.ca = "";

    this.tpAmb = options.env === "producao" ? "1" : "2";
    this.cUF = getUfCode(options.uf);

    this.xmlNamespace = {
      "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
    };
  }

  private async getCa(): Promise<string> {
    if (!this.ca) {
      this.ca = await loadNfeCa();
    }
    return this.ca;
  }

  private getUrl(service: WebService): string {
    return getWebServiceUrl({
      service,
      uf: this.uf,
      env: this.env,
      contingency: this.contingency,
    });
  }

  private async request<Body, NfeRequestResponse>(
    url: string,
    options: NfeRequestOptions<Body>,
  ): Promise<NfeRequestResponse> {
    const { body, timeout } = options;
    const { cert, key } = this.certificate.asPem();

    return await fetchWithTls(url, {
      method: "POST",
      headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
      body: buildSoap(body),
      tls: {
        cert,
        key,
        ca: await this.getCa(),
      },
      signal: AbortSignal.timeout(timeout),
    })
      .then(async (res) => {
        return await res.text();
      })
      .then((xml) => {
        return parseSoap<NfeRequestResponse>(xml);
      })
      .catch((error: Error) => {
        if (error.name === "TimeoutError") {
          throw error;
        }
        throw new ServiceRequestError(error, { url, xml: buildSoap(body) });
      });
  }

  /**
   * @description Consulta do status do serviço prestado pelo Portal da Secretaria de Fazenda Estadual.
   *
   * @returns {Promise<NfeStatusServicoResponse>} O status do serviço.
   */
  async statusServico(): Promise<NfeStatusServicoResponse> {
    const reqResponse: { retConsStatServ: NfeStatusServicoRaw } =
      await this.request(this.getUrl("NfeStatusServico"), {
        timeout: this.timeout,
        body: {
          "@_xmlns":
            "http://www.portalfiscal.inf.br/nfe/wsdl/NFeStatusServico4",
          consStatServ: {
            ...this.xmlNamespace,
            "@_versao": "4.00",
            tpAmb: this.tpAmb,
            cUF: this.cUF,
            xServ: "STATUS",
          },
        },
      });

    return {
      status: getInfoStatus(reqResponse.retConsStatServ.cStat),
      description: reqResponse.retConsStatServ.xMotivo ?? "",
      raw: reqResponse.retConsStatServ,
    };
  }

  /**
   * @description Consulta o cadastro de contribuintes do ICMS da unidade federada.
   *
   * @param {NfeConsultaCadastroOptions} options - Opções para a consulta.
   * @returns {Promise<NfeConsultaCadastroResponse>} Informações sobre o cadastro do contribuinte.
   */
  async consultaCadastro(
    options: NfeConsultaCadastroOptions,
  ): Promise<NfeConsultaCadastroResponse> {
    const serviceResponse: { retConsCad: NfeConsultaCadastroRaw } =
      await this.request(this.getUrl("NfeConsultaCadastro"), {
        timeout: this.timeout,
        body: {
          "@_xmlns":
            "http://www.portalfiscal.inf.br/nfe/wsdl/CadConsultaCadastro4",
          ConsCad: {
            ...this.xmlNamespace,
            "@_versao": "2.00",
            infCons: { xServ: "CONS-CAD", UF: this.uf, ...options },
          },
        },
      });

    return {
      status: getInfoStatus(serviceResponse.retConsCad.infCons?.cStat),
      description: serviceResponse.retConsCad.infCons?.xMotivo ?? "",
      raw: serviceResponse.retConsCad,
    };
  }

  autorizacao() {
    throw new Error("Method not implemented.");
  }
}
