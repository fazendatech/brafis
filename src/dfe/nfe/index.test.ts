import { describe, test, expect, afterEach, spyOn, beforeEach } from "bun:test";
import { mock, clearMocks } from "bun-bagel";
import { XMLBuilder } from "fast-xml-parser";

import { CertificateP12 } from "@/certificate";

import { NfeWebServices } from "./index.ts";
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

describe("NfeWebServices", () => {
  const certificate = new CertificateP12({
    pfx: new Uint8Array(),
    password: "",
  });
  const service = new NfeWebServices({
    uf: "DF",
    env: "homologacao",
    certificate,
  });

  beforeEach(() => {
    spyOn(certificate, "asPem").mockReturnValueOnce({ cert: "", key: "" });
  });

  afterEach(() => {
    clearMocks();
  });

  describe("statusServico", () => {
    const url =
      "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx";

    test("Nfe get status success", async () => {
      const mockResponse = {
        nfeResultMsg: {
          retConsStatServ: {
            tpAmb: "2",
            cStat: "107",
            xMotivo: "Servico em Operacao",
            cUF: "53",
          },
        },
      };
      mock(url, {
        method: "POST",
        response: {
          status: 200,
          headers: {
            "content-type": "application/soap+xml; charset=utf-8",
          },
          data: buildMockResponse(mockResponse),
        },
      });

      const raw = mockResponse.nfeResultMsg.retConsStatServ;
      expect(await service.statusServico()).toMatchObject({
        status: "operando",
        description: raw.xMotivo,
        raw,
      });
    });

    test("Request timeout", () => {
      mock(url, {
        method: "POST",
        throw: new Error("The operation timed out."),
      });

      expect(() => service.statusServico()).toThrowError(
        "The operation timed out.",
      );
    });

    test("Request throw ServiceRequestError", () => {
      mock(url, {
        method: "POST",
        throw: new Error("An error occurred during the request."),
      });

      expect(() => service.statusServico()).toThrowError(ServiceRequestError);
    });
  });

  describe("consultaCadastro", () => {
    const url =
      "https://cad-homologacao.svrs.rs.gov.br/ws/cadconsultacadastro/cadconsultacadastro4.asmx";

    test("Nfe get register consult success", async () => {
      const mockResponse = {
        nfeResultMsg: {
          retConsCad: {
            infCons: {
              cStat: "111",
              xMotivo: "Consulta cadastro com uma ocorrência",
            },
          },
        },
      };
      mock(url, {
        method: "POST",
        response: {
          headers: {
            "content-type": "application/soap+xml; charset=utf-8",
          },
          data: buildMockResponse(mockResponse),
        },
      });

      const raw = mockResponse.nfeResultMsg.retConsCad;
      expect(await service.consultaCadastro({})).toMatchObject({
        status: "uma-ocorrencia",
        description: raw.infCons.xMotivo,
        raw,
      });
    });
  });
});
