import type { CertificateP12 } from "@/certificate";
import { loadNfeCa } from "@/dfe/nfe/ca";
import {
  parseNfe,
  type NfeLayout,
  type NfeLayoutWithSignature,
} from "@/dfe/nfe/layout";
import { signXml } from "@/certificate/sign";
import { getWebServiceUrl } from "@/dfe/nfe/webServiceUrls";
import type {
  Environment,
  NfeWebService,
} from "@/dfe/nfe/webServiceUrls/types";
import { getUfCode } from "@/ufCode";
import type { Uf, UfCode } from "@/ufCode/types";
import { fetchWithTls } from "@/utils/fetch";
import { buildSoap, parseSoap } from "@/utils/soap";
import { zCustom } from "@/utils/zCustom";

import { NfeServiceRequestError } from "./errors";
import type { NfeRequestOptions } from "./requests/common";
import {
  schemaNfeConsultaCadastroOptions,
  type NfeConsultaCadastroOptions,
  type NfeConsultaCadastroRequest,
  type NfeConsultaCadastroResponse,
} from "./requests/consultaCadastro";
import type {
  NfeStatusServicoRequest,
  NfeStatusServicoResponse,
} from "./requests/statusServico";
import type {
  NfeAutorizacaoOptions,
  NfeAutorizacaoRequest,
  NfeAutorizacaoResponse,
} from "./requests/autorizacao";
import type { NfeWebServicesOptions } from "./types";
import type {
  NfeInutilizacaoInutNfe,
  NfeInutilizacaoInutNfeWithSignature,
  NfeInutilizacaoOptions,
  NfeInutilizacaoRequest,
  NfeInutilizacaoResponse,
} from "./requests/inutilizacao";
import type {
  NfeRecepcaoEventoEventoWithSignature,
  NfeRecepcaoEventoOptions,
  NfeRecepcaoEventoRequest,
  NfeRecepcaoEventoResponse,
  CpfOrCnpj,
  NfeRecepcaoEventoEvento,
} from "./requests/recepcaoEvento";
import type {
  NfeConsultaProtocoloOptions,
  NfeConsultaProtocoloRequest,
  NfeConsultaProtocoloResponse,
} from "./requests/consultaProtocolo";
import helpersRecepcaoEvento from "./helpers/recepcaoEvento";
import helpersAutorizacao from "./helpers/autorizacao";
import type {
  NfeDistribuicaoDfeOperation,
  NfeDistribuicaoDfeOptions,
  NfeDistribuicaoDfeRequest,
  NfeDistribuicaoDfeResponse,
} from "./requests/distribuicaoDfe";

export class NfeWebServices {
  private uf: Uf;
  private env: Environment;
  private certificate: CertificateP12;
  private contingency: boolean;
  private timeout: number;
  private ca: string;
  private tpAmb: "1" | "2";
  private cUF: UfCode;

  constructor(options: NfeWebServicesOptions) {
    this.uf = options.uf;
    this.env = options.env;
    this.certificate = options.certificate;
    this.contingency = options.contingency ?? false;
    this.timeout = options.timeout ?? 15000;
    this.ca = "";

    this.tpAmb = options.env === "producao" ? "1" : "2";
    this.cUF = getUfCode(options.uf);
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
    { body, timeout, arrayTags }: NfeRequestOptions<Body>,
  ): Promise<NfeRequestResponse> {
    const { cert, key } = this.certificate.asPem();
    const response = await fetchWithTls(url, {
      method: "POST",
      headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
      body: buildSoap(body),
      tls: { cert, key, ca: await this.getCa() },
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      throw new NfeServiceRequestError(
        `${response.statusText} (${response.status}) - ${url}`,
      );
    }

    const responseBody = await response.text();
    const parsedResponse = parseSoap<NfeRequestResponse>(responseBody, {
      arrayTags,
    });

    if (!parsedResponse) {
      throw new NfeServiceRequestError(`URL: ${url}\n${responseBody}`);
    }

    return parsedResponse;
  }

  /**
   * @description Consulta o status do serviço do SEFAZ correspondente a uma UF.
   *
   * @returns {Promise<NfeStatusServicoResponse>} O resultado do serviço.
   *
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async statusServico(): Promise<NfeStatusServicoResponse> {
    return await this.request<
      NfeStatusServicoRequest,
      NfeStatusServicoResponse
    >(this.getUrl("NfeStatusServico"), {
      timeout: this.timeout,
      body: {
        nfeDadosMsg: {
          "@_xmlns":
            "http://www.portalfiscal.inf.br/nfe/wsdl/NFeStatusServico4",
          consStatServ: {
            "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
            "@_versao": "4.00",
            tpAmb: this.tpAmb,
            cUF: this.cUF,
            xServ: "STATUS",
          },
        },
      },
    });
  }

  /**
   * @description Consulta o cadastro de contribuintes do ICMS em uma UF.
   *
   * @param {NfeConsultaCadastroOptions} options - Opções para o serviço.
   *
   * @returns {Promise<NfeConsultaCadastroResponse>} O resultado do serviço.
   *
   * @throws {Zod.ZodError}Se os parâmetros informados não forem válidos.
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async consultaCadastro(
    options: NfeConsultaCadastroOptions,
  ): Promise<NfeConsultaCadastroResponse> {
    schemaNfeConsultaCadastroOptions.parse(options);

    return await this.request<
      NfeConsultaCadastroRequest,
      NfeConsultaCadastroResponse
    >(this.getUrl("NfeConsultaCadastro"), {
      timeout: this.timeout,
      body: {
        nfeDadosMsg: {
          "@_xmlns":
            "http://www.portalfiscal.inf.br/nfe/wsdl/CadConsultaCadastro4",
          ConsCad: {
            "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
            "@_versao": "2.00",
            infCons: { xServ: "CONS-CAD", UF: this.uf, ...options },
          },
        },
      },
      arrayTags: ["infCad"],
    });
  }

  /**
   * @description Envia uma NFe para autorização.
   *
   * @param {NfeAutorizacaoOptions} options - Opções para o serviço.
   *
   * @returns {Promise<NfeAutorizacaoResponse>} O resultado do serviço.
   *
   * @throws {Zod.ZodError} Se os parâmetros informados não forem válidos.
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async autorizacao({
    idLote,
    nfe,
  }: NfeAutorizacaoOptions): Promise<NfeAutorizacaoResponse> {
    parseNfe(nfe);

    const signedNfe = signXml<NfeLayout, NfeLayoutWithSignature>({
      xmlObject: nfe,
      certificate: this.certificate,
      signId: nfe.NFe.infNFe["@_Id"],
    });
    const response = await this.request<
      NfeAutorizacaoRequest,
      NfeAutorizacaoResponse
    >(this.getUrl("NFeAutorizacao"), {
      timeout: this.timeout,
      body: {
        nfeDadosMsg: {
          "@_xmlns": "http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4",
          enviNFe: {
            "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
            "@_versao": "4.00",
            idLote,
            indSinc: "1",
            ...signedNfe,
          },
        },
      },
    });
    const xml = helpersAutorizacao.buildNfeProc({
      xmlns: "http://www.portalfiscal.inf.br/nfe",
      nfe: signedNfe,
      protNFe: response.nfeResultMsg.retEnviNFe.protNFe,
    });
    return {
      ...response,
      xml,
    };
  }

  /**
   * @description Inutiliza um segmento de numerações de NFe.
   *
   * @param {NfeInutilizacaoOptions} options - Opções para o serviço.
   *
   * @returns {Promise<NfeInutilizacaoResponse>} O resultado do serviço.
   *
   * @throws {Zod.ZodError} Se os parâmetros informados não forem válidos.
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async inutilizacao({
    ano,
    CNPJ,
    mod,
    serie,
    nNFIni,
    nNFFin,
    xJust,
  }: NfeInutilizacaoOptions): Promise<NfeInutilizacaoResponse> {
    // TODO: Validar resto do input.
    zCustom.cnpj().parse(CNPJ);

    // NOTE: Definido na seção 5.3.1 do Manual de Orientação do Contribuinte Versão 7.00
    const id = `ID${this.cUF}${ano}${CNPJ}${mod}${serie}${nNFIni}${nNFFin}`;
    const signedInutNfe = signXml<
      NfeInutilizacaoInutNfe,
      NfeInutilizacaoInutNfeWithSignature
    >({
      certificate: this.certificate,
      signId: id,
      xmlObject: {
        inutNFe: {
          "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
          "@_versao": "4.00",
          infInut: {
            "@_Id": id,
            tpAmb: this.tpAmb,
            xServ: "INUTILIZAR",
            cUF: this.cUF,
            ano,
            CNPJ,
            mod,
            serie,
            nNFIni,
            nNFFin,
            xJust,
          },
        },
      },
    });
    return await this.request<NfeInutilizacaoRequest, NfeInutilizacaoResponse>(
      this.getUrl("NfeInutilizacao"),
      {
        timeout: this.timeout,
        body: {
          nfeDadosMsg: {
            "@_xmlns":
              "http://www.portalfiscal.inf.br/nfe/wsdl/NFeInutilizacao4",
            ...signedInutNfe,
          },
        },
      },
    );
  }

  /**
   * @description Serviço destinado à recepção de mensagem de Evento da NF-e
   *
   * @param {NfeRecepcaoEventoOptions} options - Opções para o serviço.
   *
   * @returns {Promise<NfeRecepcaoEventoResponse>} O resultado do serviço.
   *
   * @throws {Zod.ZodError} Se os parâmetros informados não forem válidos.
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

    const recepcaoEvento = helpersRecepcaoEvento.buildEvento({
      xmlns: "http://www.portalfiscal.inf.br/nfe",
      cUf: this.cUF,
      tpAmb: this.tpAmb,
      detEvento,
      cpfOrCnpj,
      chNFe,
      dhEvento,
      nSeqEvento,
    });
    const signedRecepcaoEvento = signXml<
      NfeRecepcaoEventoEvento,
      NfeRecepcaoEventoEventoWithSignature
    >({
      xmlObject: recepcaoEvento,
      certificate: this.certificate,
      signId: recepcaoEvento.evento.infEvento["@_Id"],
    });
    const response = await this.request<
      NfeRecepcaoEventoRequest,
      NfeRecepcaoEventoResponse
    >(this.getUrl("RecepcaoEvento"), {
      timeout: this.timeout,
      body: {
        nfeDadosMsg: {
          "@_xmlns":
            "http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4",
          envEvento: {
            "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
            "@_versao": "1.00",
            idLote,
            ...signedRecepcaoEvento,
          },
        },
      },
    });

    const xml = helpersRecepcaoEvento.buildProcEventoNfe({
      xmlns: "http://www.portalfiscal.inf.br/nfe",
      evento: signedRecepcaoEvento,
      retEvento: response.nfeResultMsg.retEnvEvento.retEvento,
    });
    return {
      ...response,
      xml,
    };
  }

  /**
   * @description Consulta a situação atual da NF-e na Base de Dados do Portal da Secretaria de Fazenda Estadual.
   *
   * @param {NfeConsultaProtocoloOptions} options - Opções para o serviço.
   *
   * @returns {Promise<NfeConsultaProtocoloResponse>} O resultado do serviço.
   *
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async consultaProtocolo({
    chNFe,
  }: NfeConsultaProtocoloOptions): Promise<NfeConsultaProtocoloResponse> {
    const schemaChNfe = zCustom.numeric().length(44);
    schemaChNfe.parse(chNFe);

    return await this.request<
      NfeConsultaProtocoloRequest,
      NfeConsultaProtocoloResponse
    >(this.getUrl("NfeConsultaProtocolo"), {
      timeout: this.timeout,
      body: {
        nfeDadosMsg: {
          "@_xmlns":
            "http://www.portalfiscal.inf.br/nfe/wsdl/NFeConsultaProtocolo4",
          consSitNFe: {
            "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
            "@_versao": "4.00",
            tpAmb: this.tpAmb,
            xServ: "CONSULTAR",
            chNFe,
          },
        },
      },
      arrayTags: ["procEventoNFe"],
    });
  }

  /**
   * @description Consulta a distribuição de informações resumidas e documentos fiscais eletrônicos de interesse de um ator, seja este uma pessoa física ou jurídica.
   *
   * @param {NfeDistribuicaoDfeOptions} options - Opções para o serviço.
   *
   * @returns {Promise<NfeDistribuicaoDfeResponse>} O resultado do serviço.
   *
   * @throws {Zod.ZodError} Se os parâmetros informados não forem válidos.
   * @throws {TimeoutError} Se a requisição exceder o tempo limite.
   * @throws {NfeServiceRequestError} Se ocorrer um erro durante a requisição.
   */
  async distribuicaoDfe({
    CPF,
    CNPJ,
    distNSU,
    consNSU,
    consChNFe,
  }: NfeDistribuicaoDfeOptions): Promise<NfeDistribuicaoDfeResponse> {
    let cpfOrCnpj: CpfOrCnpj;
    if (CPF) {
      zCustom.cpf().parse(CPF);
      cpfOrCnpj = { CPF };
    } else {
      zCustom.cnpj().parse(CNPJ);
      cpfOrCnpj = { CNPJ } as CpfOrCnpj;
    }

    let operation: NfeDistribuicaoDfeOperation;
    if (distNSU) {
      const schema = zCustom.numeric().length(15);
      schema.parse(distNSU.ultNSU);
      operation = { distNSU: { ultNSU: distNSU.ultNSU.padStart(15, "0") } };
    } else if (consNSU) {
      const schema = zCustom.numeric().length(15);
      schema.parse(consNSU.NSU);
      operation = { consNSU: { NSU: consNSU.NSU.padStart(15, "0") } };
    } else {
      const schema = zCustom.numeric().length(44);
      schema.parse(consChNFe.chNFe);
      operation = { consChNFe };
    }

    return await this.request<
      NfeDistribuicaoDfeRequest,
      NfeDistribuicaoDfeResponse
    >(this.getUrl("NFeDistribuicaoDFe"), {
      timeout: this.timeout,
      body: {
        nfeDistDFeInteresse: {
          "@_xmlns":
            "http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe",
          nfeDadosMsg: {
            distDFeInt: {
              "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
              "@_versao": "1.01",
              tpAmb: this.tpAmb,
              cUFAutor: this.cUF,
              ...cpfOrCnpj,
              ...operation,
            },
          },
        },
      },
      arrayTags: ["docZip"],
    });
  }
}
