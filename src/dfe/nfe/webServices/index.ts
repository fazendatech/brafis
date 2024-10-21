import type { CertificateP12 } from "@/certificate";
import { buildSoap, fetchWithTls, parseSoap, type WithXmlns } from "@/utils";
import { getUfCode, type UF, type UFCode } from "@/ufCode";
import { loadNfeCa } from "@/dfe/nfe/ca";
import {
  type Environment,
  type NfeWebService,
  getWebServiceUrl,
} from "@/dfe/nfe/webServiceUrls";

import type { NfeWebServicesOptions } from "./types";
import type {
  NfeRequestOptions,
  NfeConsultaCadastroOptions,
  NfeConsultaCadastroStatus,
  NfeConsultaCadastroResponseRaw,
  NfeConsultaCadastroRequest,
  NfeStatusServicoStatus,
  NfeStatusServicoResponseRaw,
  NfeStatusServicoRequest,
  NfeConsultaCadastroResponse,
  NfeStatusServicoResponse,
} from "./requests";
import { NfeServiceRequestError } from "./errors";

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

  private getUrl(service: NfeWebService): string {
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
    const soapBody = buildSoap({ nfeDadosMsg: body });

    return fetchWithTls(url, {
      method: "POST",
      headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
      body: soapBody,
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
        throw new NfeServiceRequestError(error, { url, xml: soapBody });
      });
  }

  /**
   * @description Consulta o status do serviço do SEFAZ correspondente a uma UF.
   *
   * @returns {Promise<NfeStatusServicoResponse>} O status do serviço.
   */
  async statusServico(): Promise<NfeStatusServicoResponse> {
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
   * @returns {Promise<NfeConsultaCadastroResponse>} Informações sobre o cadastro do contribuinte.
   */
  async consultaCadastro(
    options: NfeConsultaCadastroOptions,
  ): Promise<NfeConsultaCadastroResponse> {
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

export { NfeServiceRequestError };

export type { NfeWebServicesOptions };
