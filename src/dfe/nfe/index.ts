import type { CertificateP12 } from "@/certificate";
import type {
  Environment,
  UF,
  StatusServicoResponse,
  StatusServicoOptions,
  Status,
  StatusRaw,
  ConsultaCadastroOptions,
} from "@/dfe/nfe/types";
import { build, fetchWithTls, parse } from "@/utils/index.ts";
import { getWebServiceUrl } from "./webServiceUrls.ts";
import { loadNfeCa } from "./ca.ts";
import { getUfCode } from "./ufCode.ts";
import { NfeConsultaCadastroError, NfeStatusServicoError } from "./errors.ts";

export interface NfeWebServicesOptions {
  uf: UF;
  env: Environment;
  certificate: CertificateP12;
  contingency?: boolean;

  statusServicoTimeout?: number;
  consultaCadastroTimeout?: number;
}

export class NfeWebServices {
  private uf: UF;
  private env: Environment;
  private certificate: CertificateP12;
  private contingency: boolean;

  private statusServicoTimeout?: number;
  private consultaCadastroTimeout?: number;

  private ca?: string;
  private tpAmb: string;
  private cUF?: string;

  constructor(options: NfeWebServicesOptions) {
    this.uf = options.uf;
    this.env = options.env;
    this.certificate = options.certificate;
    this.contingency = options.contingency ?? false;

    this.statusServicoTimeout = options.statusServicoTimeout;
    this.consultaCadastroTimeout = options.consultaCadastroTimeout;

    this.tpAmb = options.env === "producao" ? "1" : "2";
    this.cUF = getUfCode(options.uf);
  }

  private async getCa(): Promise<string> {
    if (!this.ca) {
      this.ca = await loadNfeCa();
    }
    return this.ca;
  }

  private async request<Body extends BodyInit, Response>(
    url: string,
    body: Body,
    timeout = 15000,
  ): Promise<Response> {
    const { cert, key } = this.certificate.asPem();

    return await fetchWithTls(url, {
      method: "POST",
      headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
      body: body,
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
      .catch((err) => {
        throw err;
      })
      .then((xml) => {
        return parse(xml);
      });
  }

  private withNameSpace<Obj>(obj: Obj): Obj {
    return {
      "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
      "@_versao": "4.00",
      ...obj,
    };
  }

  /**
   * @description Verifica o status do serviço NFe.
   *
   * @param {StatusServicoOptions} [options] - Parâmetros opcionais para a solicitação do serviço de status.
   *
   * @returns Uma promise com status do serviço.
   *
   * @throws {NfeStatusServicoError} Se a solicitação falhar.
   */
  async statusServico(
    options?: StatusServicoOptions,
  ): Promise<Status | StatusRaw> {
    const data = build({
      "@_xmlns": "http://www.portalfiscal.inf.br/nfe/wsdl/NFeStatusServico4",
      consStatServ: this.withNameSpace({
        tpAmb: this.tpAmb,
        cUF: this.cUF,
        xServ: "STATUS",
      }),
    });

    const url = getWebServiceUrl({
      service: "NfeStatusServico",
      uf: this.uf,
      env: this.env,
      contingency: this.contingency,
    });

    try {
      const serviceResponse: StatusServicoResponse = await this.request(
        url,
        data,
        options?.timeout ?? this.statusServicoTimeout,
      );

      return options?.raw
        ? serviceResponse.nfeResultMsg.retConsStatServ
        : (serviceResponse.nfeResultMsg.retConsStatServ as Status);
    } catch {
      throw new NfeStatusServicoError();
    }
  }

  async consultaCadastro(options: ConsultaCadastroOptions) {
    const data = build({
      "@_xmlns": "http://www.portalfiscal.inf.br/nfe/wsdl/NFeConsultaCadastro4",
      ConsCad: this.withNameSpace({
        infCons: { xServ: "CONS-CAD", UF: this.uf, ...options },
      }),
    });

    console.log(data);

    const url = getWebServiceUrl({
      uf: this.uf,
      service: "NfeConsultaCadastro",
      env: this.env,
      contingency: this.contingency,
    });

    try {
      return await this.request(url, data, this.consultaCadastroTimeout);
    } catch {
      throw new NfeConsultaCadastroError();
    }
  }

  autorizacao() {
    throw new Error("Method not implemented.");
  }
}
