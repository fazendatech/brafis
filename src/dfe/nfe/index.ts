import type { CertificateP12 } from "@/certificate";
import type { Environment, UF } from "@/dfe/nfe/types";
import { getWebServiceUrl } from "./webServiceUrls.ts";
import { errorHasMessage } from "@/utils/errors.ts";
import { getUfCode } from "./ufCode.ts";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { fetchWithTls } from "@/utils/index.ts";
import { loadNfeCa } from "./ca.ts";

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
    format: true,
  });

  private parser = new XMLParser({});

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
      const jsonResp = this.parser.parse(await response.text());

      return jsonResp["soap:Envelope"]["soap:Body"];
    } catch (error) {
      // NOTE: This is a temporary solution to handle warnings
      throw new Error((error as Error).message);
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
    const baseUrl = getWebServiceUrl({
      uf: this.uf,
      service: "NfeStatusServico",
      env: this.env,
    });

    const xmlObj = {
      consStatServ: {
        "@_versao": "4.00",
        tpAmb: this.env === "production" ? 1 : 2,
        cUF: getUfCode(this.uf),
        xServ: "STATUS",
      },
    };

    const data = this.packAndBuild(xmlObj);

    return await this.request(baseUrl, data);
  }

  autorizacao() {
    throw new Error("Method not implemented.");
  }
}
