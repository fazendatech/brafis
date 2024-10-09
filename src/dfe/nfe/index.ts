import type { CertificateP12 } from "@/certificate";
import type { Environment, UF } from "@/dfe/nfe/types";
import { getWebServiceUrl } from "./webServiceUrls.ts";
import { getUfCode } from "./ufCode.ts";
import { XMLBuilder, XMLParser, XMLValidator } from "fast-xml-parser";
import { fetchWithTls } from "@/utils/index.ts";
import { loadNfeCa } from "./ca.ts";
import { NfeStatusServiceError, ServiceRequestError } from "./errors.ts";

export interface NfeWebServicesOptions {
  uf: UF;
  env: Environment;
  certificate: CertificateP12;
}

export class NfeWebServices {
  private uf: UF;
  private env: Environment;
  private certificate: CertificateP12;

  private builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  private parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
  });

  constructor(options: NfeWebServicesOptions) {
    this.uf = options.uf;
    this.env = options.env;
    this.certificate = options.certificate;
  }

  async request(url: string, xml: string) {
    const { cert, key } = this.certificate.asPem();

    try {
      const response = await fetchWithTls(url, {
        method: "POST",
        headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
        body: xml,
        tls: {
          cert,
          key,
          ca: await loadNfeCa(),
        },
      });

      if (!response.ok) {
        return undefined;
      }

      const xmlData = await response.text();
      if (!XMLValidator.validate(xmlData)) {
        return undefined;
      }

      return this.parser.parse(xmlData).Envelope.Body;
    } catch (error) {
      // NOTE: This is a temporary solution to handle errors
      if (error instanceof Error) {
        throw new ServiceRequestError(error, url, xml);
      }
    }
  }

  packAndBuild(xmlData: object): string {
    return this.builder.build({
      "?xml": {
        "@_version": "1.0",
        "@_encoding": "UTF-8",
      },
      "soapenv:Envelope": {
        "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "@_xmlns:soapenv": "http://www.w3.org/2003/05/soap-envelope",
        "soapenv:Body": {
          nfeDadosMsg: {
            "@_xmlns":
              "http://www.portalfiscal.inf.br/nfe/wsdl/NFeStatusServico4",
            ...xmlData,
          },
        },
      },
    });
  }

  async statusServico() {
    const data = this.packAndBuild({
      consStatServ: {
        "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
        "@_versao": "4.00",
        tpAmb: this.env === "produção" ? 1 : 2,
        cUF: getUfCode(this.uf),
        xServ: "STATUS",
      },
    });

    let url = getWebServiceUrl({
      uf: this.uf,
      service: "NfeStatusServico",
      env: this.env,
      contingencia: false,
    });

    let request = await this.request(url, data);
    if (!request) {
      url = getWebServiceUrl({
        uf: this.uf,
        service: "NfeStatusServico",
        env: this.env,
        contingencia: true,
      });

      request = await this.request(url, data);
    }

    if (!request) {
      throw new NfeStatusServiceError();
    }

    return request;
  }

  autorizacao() {
    throw new Error("Method not implemented.");
  }
}
