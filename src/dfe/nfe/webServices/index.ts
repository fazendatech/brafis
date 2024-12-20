import type { CertificateP12 } from "@/certificate";
import { loadNfeCa } from "@/dfe/nfe/ca";
import { getWebServiceUrl } from "@/dfe/nfe/webServiceUrls";
import type {
  Environment,
  NfeWebService,
} from "@/dfe/nfe/webServiceUrls/types";
import { getUfCode } from "@/ufCode";
import type { UF, UFCode } from "@/ufCode/types";
import { fetchWithTls } from "@/utils/fetch";
import { buildSoap, parseSoap } from "@/utils/soap";
import type { WithXmlns } from "@/utils/soap/types";
import { TimeoutError } from "@/utils/errors";

import { NfeServiceRequestError } from "./errors";
import type { NfeRequestOptions } from "./requests/common";
import {
  schemaNfeConsultaCadastroOptions,
  type NfeConsultaCadastroOptions,
  type NfeConsultaCadastroRequest,
  type NfeConsultaCadastroResponse,
  type NfeConsultaCadastroResponseRaw,
  type NfeConsultaCadastroStatus,
} from "./requests/consultaCadastro";
import type {
  NfeStatusServicoRequest,
  NfeStatusServicoResponse,
  NfeStatusServicoResponseRaw,
  NfeStatusServicoStatus,
} from "./requests/statusServico";
import type {
  NfeAutorizacaoOptions,
  NfeAutorizacaoRequest,
  NfeAutorizacaoResponse,
  NfeAutorizacaoResponseRaw,
  NfeAutorizacaoStatus,
} from "./requests/autorizacao";
import type { NfeWebServicesOptions } from "./types";
import { signNfe } from "@/dfe/nfe/sign";
import { makeBuilder, makeParser } from "@/utils/xml";
import { parseNfe } from "../layout";

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
      .then((response) => {
        if (!response.ok) {
          throw new NfeServiceRequestError(
            `${response.statusText} (${response.status}) - ${url}`,
          );
        }
        return response.text();
      })
      .then((responseBody) => {
        const parsedResponse = parseSoap<{ nfeResultMsg?: NfeRequestResponse }>(
          responseBody,
        );
        if (!parsedResponse?.nfeResultMsg) {
          throw new NfeServiceRequestError(`URL: ${url}\n${responseBody}`);
        }
        return parsedResponse.nfeResultMsg;
      })
      .catch((error: Error) => {
        if (
          error instanceof TimeoutError ||
          error instanceof NfeServiceRequestError
        ) {
          throw error;
        }
        throw new NfeServiceRequestError(error.message);
      });
  }

  /**
   * @description Consulta o status do serviço do SEFAZ correspondente a uma UF.
   *
   * @returns {Promise<NfeStatusServicoResponse>} O status do serviço.
   *
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
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
   *
   * @returns {Promise<NfeConsultaCadastroResponse>} Informações sobre o cadastro do contribuinte.
   *
   * @throws {Zod.ZodError} Se as opções não forem válidas.
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async consultaCadastro(
    options: NfeConsultaCadastroOptions,
  ): Promise<NfeConsultaCadastroResponse> {
    schemaNfeConsultaCadastroOptions.parse(options);

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

  /**
   * @description Envia uma NFe para autorização.
   *
   * @param {NfeAutorizacaoOptions} options - Opções para a autorização.
   *
   * @returns {Promise<NfeAutorizacaoResponse>} O resultado da autorização.
   *
   * @throws {Zod.ZodError} Se as opções não forem válidas.
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async autorizacao(
    options: NfeAutorizacaoOptions,
  ): Promise<NfeAutorizacaoResponse> {
    parseNfe(options.nfe);

    const NFe = signNfe(options.nfe, this.certificate);
    const { retEnviNFe } = await this.request<
      NfeAutorizacaoRequest,
      { retEnviNFe: NfeAutorizacaoResponseRaw }
    >(this.getUrl("NFeAutorizacao"), {
      timeout: this.timeout,
      body: {
        "@_xmlns": "http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4",
        enviNFe: {
          ...this.xmlNamespace,
          "@_versao": "4.00",
          idLote: options.idLote,
          indSinc: "0",
          //NOTE: Testar se é possível passar o objeto NFe diretamente e assinar depois o XML completo
          NFe: makeBuilder().build(makeParser().parse(NFe).NFe),
        },
      },
    });

    const statusMap: Record<string, NfeAutorizacaoStatus> = {
      "100": "uso-autorizado",
      "110": "uso-denegado",
      "150": "uso-autorizado",
    };

    return {
      status: statusMap[retEnviNFe.cStat] ?? "outro",
      description: retEnviNFe.xMotivo ?? "",
      raw: retEnviNFe,
    };
  }

  /**
   * @description Inutiliza um segmento de numerações de NFe.
   *
   * @param {NfeInutilizacaoOptions} options - Opções para a inutilização.
   *
   * @returns {Promise<NfeInutilizacaoResponse>} O resultado da inutilização.
   *
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
}
