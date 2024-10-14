import type { CertificateP12 } from "@/certificate";
import type { Environment, UF, ConsultaCadastroOptions } from "@/dfe/nfe/types";
import { build, fetchWithTls, parse } from "@/utils/index.ts";
import { getWebServiceUrl } from "./webServiceUrls.ts";
import { loadNfeCa } from "./ca.ts";
import { getUfCode } from "./ufCode.ts";
import { NfeStatusServiceError } from "./errors.ts";

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

  constructor(opt: NfeWebServicesOptions) {
    this.uf = opt.uf;
    this.env = opt.env;
    this.certificate = opt.certificate;
    this.contingency = opt.contingency ?? false;

    this.statusServicoTimeout = opt.statusServicoTimeout;
    this.consultaCadastroTimeout = opt.consultaCadastroTimeout;

    this.tpAmb = opt.env === "producao" ? "1" : "2";
    this.cUF = getUfCode(opt.uf);
  }

  private async getCa(): Promise<string> {
    if (!this.ca) {
      this.ca = await loadNfeCa();
    }
    return this.ca;
  }

  private async request(
    url: string,
    xml: string,
    timeout = 15000,
  ): Promise<object> {
    const { cert, key } = this.certificate.asPem();

    return await fetchWithTls(url, {
      method: "POST",
      headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
      body: xml,
      tls: {
        cert,
        key,
        ca: await this.getCa(),
      },
      signal: AbortSignal.timeout(timeout),
    })
      .then((res) => {
        return res.text();
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

  statusServico() {
    const data = build({
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
      return this.request(url, data, this.statusServicoTimeout);
    } catch {
      throw new NfeStatusServiceError();
    }
  }

  consultaCadastro() {
    throw new Error("Method not implemented.");
  }

  autorizacao() {
    throw new Error("Method not implemented.");
  }
}
