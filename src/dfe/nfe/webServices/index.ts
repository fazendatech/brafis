import type { CertificateP12 } from "@/certificate";
import { loadNfeCa } from "@/dfe/nfe/ca";
import { parseNfe } from "@/dfe/nfe/layout";
import { signXml } from "@/dfe/nfe/sign";
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
  NfeAutorizacaoStatusProtocolo,
} from "./requests/autorizacao";
import type { NfeWebServicesOptions } from "./types";
import type {
  NfeInutilizacaoOptions,
  NfeInutilizacaoRequest,
  NfeInutilizacaoResponse,
  NfeInutilizacaoResponseRaw,
  NfeInutilizacaoStatus,
} from "./requests/inutilizacao";
import { zCustom } from "@/utils/zCustom";

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
    { body, timeout, signId }: NfeRequestOptions<Body>,
  ): Promise<NfeRequestResponse> {
    const { cert, key } = this.certificate.asPem();
    let soapBody = buildSoap({ nfeDadosMsg: body });

    if (signId) {
      soapBody = signXml({
        xml: soapBody,
        certificate: this.certificate,
        signId,
      });
    }

    const response = await fetchWithTls(url, {
      method: "POST",
      headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
      body: soapBody,
      tls: { cert, key, ca: await this.getCa() },
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      throw new NfeServiceRequestError(
        `${response.statusText} (${response.status}) - ${url}`,
      );
    }

    const responseBody = await response.text();
    const parsedResponse = parseSoap<{ nfeResultMsg?: NfeRequestResponse }>(
      responseBody,
    );
    if (!parsedResponse?.nfeResultMsg) {
      throw new NfeServiceRequestError(`URL: ${url}\n${responseBody}`);
    }

    return parsedResponse.nfeResultMsg;
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
   * @throws {Zod.ZodError} Se a NFe não estiver válida.
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async autorizacao({
    idLote,
    nfe,
  }: NfeAutorizacaoOptions): Promise<NfeAutorizacaoResponse> {
    parseNfe(nfe);

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
          idLote: idLote,
          indSinc: "1",
          ...nfe,
        },
      },
      signId: nfe.NFe.infNFe["@_Id"],
    });

    const statusProtocoloMap: Record<string, NfeAutorizacaoStatusProtocolo> = {
      "100": "uso-autorizado",
    };
    const cStatProtocolo = retEnviNFe.protNFe?.infProt.cStat;
    const protocolo = cStatProtocolo
      ? {
          status: statusProtocoloMap[cStatProtocolo] ?? "erro",
          description: retEnviNFe.protNFe?.infProt.xMotivo ?? "",
        }
      : null;
    const xml = null;
    // const xml = cStatProtocolo
    //   ? makeBuilder().build({
    //       "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
    //       nfeProc: {
    //         "@_versao": "4.00",
    //         "@_xmlns": this.xmlNamespace["@_xmlns"],
    //         ...signedNfe,
    //         protNFe: retEnviNFe.protNFe,
    //       },
    //     })
    //   : null;

    const statusMap: Record<string, NfeAutorizacaoStatus> = {
      "103": "lote-recebido",
      "104": "lote-processado",
      "105": "lote-em-processamento",
      "106": "lote-nao-localizado",
    };

    return {
      status: statusMap[retEnviNFe.cStat] ?? "outro",
      description: retEnviNFe.xMotivo ?? "",
      raw: retEnviNFe,
      protocolo,
      xml,
    };
  }

  /**
   * @description Inutiliza um segmento de numerações de NFe.
   *
   * @param {NfeInutilizacaoOptions} options - Opções para a inutilização.
   *
   * @returns {Promise<NfeInutilizacaoResponse>} O resultado da inutilização.
   *
   * @throws {Zod.ZodError} Se o CNPJ informado não for válido.
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async inutilizacao({
    ano,
    cnpj,
    mod,
    serie,
    nNfIni,
    nNfFin,
    xJust,
  }: NfeInutilizacaoOptions): Promise<NfeInutilizacaoResponse> {
    zCustom.cnpj().parse(cnpj);

    // NOTE: Id definido na seção 5.3.1
    const id = `ID${this.cUF}${ano}${cnpj}${mod}${serie}${nNfIni}${nNfFin}`;
    const { retInutNFe } = await this.request<
      NfeInutilizacaoRequest,
      { retInutNFe: NfeInutilizacaoResponseRaw }
    >(this.getUrl("NfeInutilizacao"), {
      timeout: this.timeout,
      body: {
        "@_xmlns": "http://www.portalfiscal.inf.br/nfe/wsdl/NFeInutilizacao4",
        inutNFe: {
          ...this.xmlNamespace,
          "@_versao": "4.00",
          infInut: {
            "@_Id": id,
            tpAmb: this.tpAmb,
            xServ: "INUTILIZAR",
            cUF: this.cUF,
            ano,
            CNPJ: cnpj,
            mod,
            serie,
            nNFIni: nNfIni,
            nNFFin: nNfFin,
            xJust,
          },
        },
      },
      signId: id,
    });
    const statusMap: Record<string, NfeInutilizacaoStatus> = {
      "102": "homologada",
    };

    return {
      status: statusMap[retInutNFe.infInut.cStat] ?? "outro",
      description: retInutNFe.infInut.xMotivo ?? "",
      raw: retInutNFe,
    };
  }
}
