import { describe, test, expect, afterEach, spyOn } from "bun:test";
import { mock, clearMocks } from "bun-bagel";
import type { MockOptions } from "bun-bagel";
import { CertificateP12 } from "@/certificate";
import { NfeWebServices } from "./index.ts";
import { XMLBuilder } from "fast-xml-parser";
import { NfeStatusServicoError } from "./errors.ts";
import type { Status, StatusRaw } from "./types.ts";

function buildMockResponse<Obj>(obj: Obj): string {
  const xmlBuilder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  return xmlBuilder.build({
    "?xml": {
      "@_version": "1.0",
      "@_encoding": "UTF-8",
    },
    "soapenv:Envelope": {
      "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
      "@_xmlns:soap": "http://www.w3.org/2003/05/soap-envelope",
      "soapenv:Body": {
        ...obj,
      },
    },
  });
}

describe("NfeWebServices", async () => {
  afterEach(() => {
    clearMocks();
  });

  test("Nfe get status sucess", async () => {
    const service = new NfeWebServices({
      uf: "DF",
      env: "homologacao",
      certificate: new CertificateP12({ pfx: new Uint8Array(), password: "" }),
    });

    const testObj = {
      tpAmb: 2,
      cStat: 107,
      xMotivo: "Servico em Operacao",
      cUF: 53,
    };

    spyOn(CertificateP12.prototype, "asPem").mockReturnValueOnce({
      cert: "",
      key: "",
    });

    const opt: MockOptions = {
      method: "POST",
      response: {
        status: 200,
        headers: {
          "content-type": "application/soap+xml; charset=utf-8",
        },
        data: buildMockResponse({ nfeResultMsg: { retConsStatServ: testObj } }),
      },
    };

    mock(
      "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx",
      opt,
    );
    expect(await service.statusServico()).toMatchObject(testObj);
  });

  test("Nfe throws error when try get status", async () => {
    const service = new NfeWebServices({
      uf: "DF",
      env: "homologacao",
      certificate: new CertificateP12({ pfx: new Uint8Array(), password: "" }),
    });

    spyOn(CertificateP12.prototype, "asPem").mockReturnValueOnce({
      cert: "",
      key: "",
    });

    const opt: MockOptions = {
      method: "POST",
      response: {
        status: 500,
        headers: {
          "content-type": "application/soap+xml; charset=utf-8",
        },
        data: {},
      },
    };

    mock(
      "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx",
      opt,
    );

    await expect(service.statusServico()).rejects.toThrowError(
      NfeStatusServicoError,
    );
  });
});
