import type { CertificateP12 } from "@/certificate";
import type {
  Environment,
  NfeRequestOptions,
  NfeConsultaCadastroOptions,
  UF,
  UFCode,
  WebService,
  NfeStatusServicoResponseRaw,
  NfeConsultaCadastroResponseRaw,
  NfeStatusServicoRequest,
  NfeConsultaCadastroRequest,
  NfeWebServiceResponse,
  NfeStatusServicoStatus,
  NfeConsultaCadastroStatus,
  WithXmlns,
} from "@/dfe/nfe/types";
import { buildSoap, fetchWithTls, parseSoap } from "@/utils";

import { getWebServiceUrl } from "./webServiceUrls.ts";
import { loadNfeCa } from "./ca.ts";
import { getUfCode } from "./ufCode.ts";
import { ServiceRequestError } from "./errors.ts";

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
  private xmlNamespace: WithXmlns;

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

  // TODO(#17) - Mudar estratégia de carregar o arquivo `nfe-ca.pem`
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
    { body, timeout }: NfeRequestOptions<Body>,
  ): Promise<NfeRequestResponse> {
    const { cert, key } = this.certificate.asPem();

    return fetchWithTls(url, {
      method: "POST",
      headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
      body: buildSoap({ nfeDadosMsg: body }),
      tls: { cert, key, ca: await this.getCa() },
      signal: AbortSignal.timeout(timeout),
    })
      .then((res) => res.text())
      .then(
        (xml) =>
          parseSoap<{ nfeResultMsg: NfeRequestResponse }>(xml).nfeResultMsg,
      )
      .catch((error: Error) => {
        if (error.name === "TimeoutError") {
          throw error;
        }
        throw new ServiceRequestError(error, { url, xml: buildSoap(body) });
      });
  }

  /**
   * @description Consulta o status do serviço do SEFAZ correspondente a uma UF.
   *
   * @returns {Promise<NfeWebServiceResponse<NfeStatusServicoStatus, NfeStatusServicoResponseRaw>>} O status do serviço.
   */
  async statusServico(): Promise<
    NfeWebServiceResponse<NfeStatusServicoStatus, NfeStatusServicoResponseRaw>
  > {
    const { retConsStatServ } = await this.request<
      NfeStatusServicoRequest,
      { retConsStatServ: NfeStatusServicoResponseRaw }
    >(this.getUrl("NfeStatusServico"), {
      timeout: this.timeout,
      body: {
        "@_xmlns": "http://www.portalfiscal.inf.br/nfe/wsdl/NFeStatusServico4",
        consStatServ: {
          ...this.xmlNamespace,
          "@_versao": "4.00",
          tpAmb: this.tpAmb,
          cUF: this.cUF,
          xServ: "STATUS",
        },
      },
    });

    const statusMap: Record<string, NfeStatusServicoStatus> = {
      "107": "operando",
      "108": "paralisado-temporariamente",
      "109": "paralisado",
    };
    return {
      status: statusMap[retConsStatServ.cStat] ?? "outro",
      description: retConsStatServ.xMotivo ?? "",
      raw: retConsStatServ,
    };
  }

  /**
   * @description Consulta o cadastro de contribuintes do ICMS em uma UF.
   *
   * @param {NfeConsultaCadastroOptions} options - Opções para a consulta.
   * @returns {Promise<NfeWebServiceResponse<NfeConsultaCadastroStatus, NfeConsultaCadastroResponseRaw>>} Informações sobre o cadastro do contribuinte.
   */
  async consultaCadastro(
    options: NfeConsultaCadastroOptions,
  ): Promise<
    NfeWebServiceResponse<
      NfeConsultaCadastroStatus,
      NfeConsultaCadastroResponseRaw
    >
  > {
    const { retConsCad } = await this.request<
      NfeConsultaCadastroRequest,
      { retConsCad: NfeConsultaCadastroResponseRaw }
    >(this.getUrl("NfeConsultaCadastro"), {
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

    const statusMap: Record<string, NfeConsultaCadastroStatus> = {
      "111": "uma-ocorrencia",
      "112": "multiplas-ocorrencias",
    };
    return {
      status: statusMap[retConsCad.infCons.cStat] ?? "outro",
      description: retConsCad.infCons.xMotivo ?? "",
      raw: retConsCad,
    };
  }

  autorizacao() {
    throw new Error("Method not implemented.");
  }
}
