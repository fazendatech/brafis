import type { CertificateP12 } from "@/certificate";
import { loadNfeCa } from "@/dfe/nfe/ca";
import { parseNfe, type NfeLayoutWithSignature } from "@/dfe/nfe/layout";
import { signXml } from "@/certificate/sign";
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
  NfeInutilizacaoInutNfe,
  NfeInutilizacaoInutNfeWithSignature,
  NfeInutilizacaoOptions,
  NfeInutilizacaoRequest,
  NfeInutilizacaoResponse,
  NfeInutilizacaoResponseRaw,
  NfeInutilizacaoStatus,
} from "./requests/inutilizacao";
import { zCustom } from "@/utils/zCustom";
import { makeBuilder } from "@/utils/xml";
import type {
  DescEvento,
  NfeRecepcaoEventoInfEvento,
  NfeRecepcaoEventoEvento,
  NfeRecepcaoEventoEventoWithSignature,
  NfeRecepcaoEventoOptions,
  NfeRecepcaoEventoRequest,
  NfeRecepcaoEventoResponse,
  NfeRecepcaoEventoResponseRaw,
  NfeRecepcaoEventoStatus,
  NfeRecepcaoEventoStatusEvento,
  OptionsCancelamento,
  OptionsCancelamentoPorSubstituicao,
  OptionsCartaDeCorrecao,
  OptionsConfirmacaoDeOperacao,
  OptionsCienciaDaOperacao,
  OptionsDesconhecimentoDeOperacao,
  OptionsOperacaoNaoRealizada,
  CpfOrCnpj,
} from "./requests/recepcaoEvento";

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
   * @throws {Zod.ZodError} Se as opções não forem válidas.
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async autorizacao({
    idLote,
    nfe,
  }: NfeAutorizacaoOptions): Promise<NfeAutorizacaoResponse> {
    parseNfe(nfe);

    const signedNfe = signXml({
      xmlObject: nfe,
      certificate: this.certificate,
      signId: nfe.NFe.infNFe["@_Id"],
    }) as NfeLayoutWithSignature;
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
          idLote,
          indSinc: "1",
          ...signedNfe,
        },
      },
    });

    const statusProtocoloMap: Record<string, NfeAutorizacaoStatusProtocolo> = {
      "100": "uso-autorizado",
    };
    const cStatProtocolo = retEnviNFe.protNFe?.infProt.cStat;
    const protNFe = cStatProtocolo
      ? {
          status: statusProtocoloMap[cStatProtocolo] ?? "erro",
          description: retEnviNFe.protNFe?.infProt.xMotivo ?? "",
        }
      : null;
    const xml = cStatProtocolo
      ? makeBuilder().build({
          "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
          nfeProc: {
            "@_versao": "4.00",
            "@_xmlns": this.xmlNamespace["@_xmlns"],
            ...signedNfe,
            protNFe: retEnviNFe.protNFe,
          },
        })
      : null;

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
      protNFe,
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
    // TODO: Validar resto do input.
    zCustom.cnpj().parse(cnpj);

    // NOTE: Id definido na seção 5.3.1
    const id = `ID${this.cUF}${ano}${cnpj}${mod}${serie}${nNfIni}${nNfFin}`;
    const inutNfe: NfeInutilizacaoInutNfe = {
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
    };
    const signedInutNfe = signXml({
      xmlObject: inutNfe,
      certificate: this.certificate,
      signId: id,
    }) as NfeInutilizacaoInutNfeWithSignature;
    const { retInutNFe } = await this.request<
      NfeInutilizacaoRequest,
      { retInutNFe: NfeInutilizacaoResponseRaw }
    >(this.getUrl("NfeInutilizacao"), {
      timeout: this.timeout,
      body: {
        "@_xmlns": "http://www.portalfiscal.inf.br/nfe/wsdl/NFeInutilizacao4",
        ...signedInutNfe,
      },
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

  /**
   * @description Serviço destinado à recepção de mensagem de Evento da NF-e
   *
   * @param {NfeRecepcaoEventoOptions} options - Opções para o evento.
   *
   * @returns {Promise<NfeRecepcaoEventoResponse>} O resultado da inutilização.
   *
   * @throws {Zod.ZodError} Se o CPF ou CNPJ informado não for válido.
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async recepcaoEvento({
    idLote,
    CPF,
    CNPJ,
    dhEvento,
    nSeqEvento,
    chNFe,
    detEvento,
  }: NfeRecepcaoEventoOptions): Promise<NfeRecepcaoEventoResponse> {
    let cpfOrCnpj: CpfOrCnpj;
    // TODO: Validar resto do input.
    if (CPF) {
      zCustom.cpf().parse(CPF);
      cpfOrCnpj = { CPF };
    } else {
      zCustom.cnpj().parse(CNPJ);
      cpfOrCnpj = { CNPJ } as CpfOrCnpj;
    }

    const eventoMap: Record<DescEvento, NfeRecepcaoEventoInfEvento> = {
      Cancelamento: {
        tpEvento: "110111",
        verEvento: "1.00",
        detEvento: {
          "@_versao": "1.00",
          ...(detEvento as OptionsCancelamento),
        },
      },
      "Cancelamento por Substituição": {
        tpEvento: "110112",
        verEvento: "1.00",
        detEvento: {
          "@_versao": "1.00",
          cOrgaoAutor: this.cUF,
          tpAutor: "1",
          ...(detEvento as OptionsCancelamentoPorSubstituicao),
        },
      },
      "Carta de Correção": {
        tpEvento: "110110",
        verEvento: "1.00",
        detEvento: {
          "@_versao": "1.00",
          xCondUso:
            "A Carta de Correção é disciplinada pelo § 1º-A do art. 7º do Convênio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularização de erro ocorrido na emissão de documento fiscal, desde que o erro não esteja relacionado com: I - as variáveis que determinam o valor do imposto tais como: base de cálculo, alíquota, diferença de preço, quantidade, valor da operação ou da prestação; II - a correção de dados cadastrais que implique mudança do remetente ou do destinatário; III - a data de emissão ou de saída.",
          ...(detEvento as OptionsCartaDeCorrecao),
        },
      },
      "Confirmação da Operação": {
        tpEvento: "210200",
        verEvento: "1.00",
        detEvento: {
          "@_versao": "1.00",
          ...(detEvento as OptionsConfirmacaoDeOperacao),
        },
      },
      "Ciência da Operação": {
        tpEvento: "210210",
        verEvento: "1.00",
        detEvento: {
          "@_versao": "1.00",
          ...(detEvento as OptionsCienciaDaOperacao),
        },
      },
      "Desconhecimento da Operação": {
        tpEvento: "210220",
        verEvento: "1.00",
        detEvento: {
          "@_versao": "1.00",
          ...(detEvento as OptionsDesconhecimentoDeOperacao),
        },
      },
      "Operação não Realizada": {
        tpEvento: "210240",
        verEvento: "1.00",
        detEvento: {
          "@_versao": "1.00",
          ...(detEvento as OptionsOperacaoNaoRealizada),
        },
      },
    };

    const infEvento = eventoMap[detEvento.descEvento];
    // NOTE: Id definido na seção 5.8.1
    const id = `ID${infEvento.tpEvento}${chNFe}${nSeqEvento}`;

    const recepcaoEvento: NfeRecepcaoEventoEvento = {
      evento: {
        "@_versao": "1.00",
        infEvento: {
          "@_Id": id,
          cOrgao: this.cUF,
          tpAmb: this.tpAmb,
          chNFe,
          dhEvento,
          nSeqEvento,
          ...cpfOrCnpj,
          ...infEvento,
        },
      },
    };

    const signedRecepcaoEvento = signXml({
      xmlObject: recepcaoEvento,
      certificate: this.certificate,
      signId: id,
    }) as NfeRecepcaoEventoEventoWithSignature;

    const { retEnvEvento } = await this.request<
      NfeRecepcaoEventoRequest,
      { retEnvEvento: NfeRecepcaoEventoResponseRaw }
    >(this.getUrl("RecepcaoEvento"), {
      timeout: this.timeout,
      body: {
        "@_xmlns": "http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4",
        envEvento: {
          ...this.xmlNamespace,
          "@_versao": "1.00",
          idLote,
          ...signedRecepcaoEvento,
        },
      },
    });

    const statusEventoMap: Record<string, NfeRecepcaoEventoStatusEvento> = {
      "135": "evento-registrado-vinculado-a-nfe",
      "136": "evento-registrado-nao-vinculado-a-nfe",
    };
    const cStatEvento = retEnvEvento.retEvento?.infEvento.cStat;
    const retEvento = cStatEvento
      ? {
          status: statusEventoMap[cStatEvento] ?? "erro",
          description: retEnvEvento.retEvento?.infEvento.xMotivo ?? "",
        }
      : null;
    const xml = cStatEvento
      ? makeBuilder().build({
          "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
          procEventoNFe: {
            "@_versao": "4.00",
            "@_xmlns": this.xmlNamespace["@_xmlns"],
            ...signedRecepcaoEvento,
            retEvento: retEnvEvento.retEvento,
          },
        })
      : null;

    const statusMap: Record<string, NfeRecepcaoEventoStatus> = {
      "128": "lote-processado",
    };

    return {
      status: statusMap[retEnvEvento.cStat] ?? "outro",
      description: retEnvEvento.xMotivo ?? "",
      raw: retEnvEvento,
      retEvento,
      xml,
    };
  }
}
