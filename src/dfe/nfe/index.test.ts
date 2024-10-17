import { describe, test, expect, afterEach, spyOn } from "bun:test";
import { mock, clearMocks } from "bun-bagel";
import { CertificateP12 } from "@/certificate";
import { NfeWebServices } from "./index.ts";
import { XMLBuilder } from "fast-xml-parser";
import { ServiceRequestError } from "./errors.ts";

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

  const certificate = new CertificateP12({
    pfx: new Uint8Array(),
    password: "",
  });

  spyOn(certificate, "asPem").mockReturnValue({
    cert: "",
    key: "",
  });

  const service = new NfeWebServices({
    uf: "DF",
    env: "homologacao",
    certificate,
  });

  const urlStatusServico =
    "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx";
  const urlConsultaCadastro = "";

  test("Nfe get status success", async () => {
    const testObj = {
      tpAmb: "2",
      cStat: "107",
      xMotivo: "Servico em Operacao",
      cUF: "53",
    };

    mock(urlStatusServico, {
      method: "POST",
      response: {
        status: 200,
        headers: {
          "content-type": "application/soap+xml; charset=utf-8",
        },
        data: buildMockResponse({
          nfeResultMsg: {
            retConsStatServ: testObj,
          },
        }),
      },
    });

    expect(await service.statusServico()).toMatchObject({
      status: "operando",
      description: testObj.xMotivo,
      raw: testObj,
    });
  });

  test("Nfe get register consult success", async () => {
    const testObj = {
      infCons: {
        cStat: "111",
        xMotivo: "Consulta cadastro com uma ocorrência",
      },
    };

    mock(urlConsultaCadastro, {
      method: "POST",
      response: {
        headers: {
          "content-type": "application/soap+xml; charset=utf-8",
        },
        data: buildMockResponse({ nfeResultMsg: { retConsCad: testObj } }),
      },
    });

    expect(await service.consultaCadastro({})).toMatchObject({
      status: "uma-ocorrência",
      description: testObj.infCons.xMotivo,
      raw: testObj,
    });
  });

  test("Nfe request throw ServiceRequestError", () => {
    mock(urlStatusServico, {
      method: "POST",
      throw: new Error("TimeoutError"),
    });

    expect(() => service.statusServico()).toThrowError(ServiceRequestError);
  });
});
