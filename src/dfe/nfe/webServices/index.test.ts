import { describe, test, expect, afterEach, spyOn, beforeEach } from "bun:test";
import { mock, clearMocks } from "bun-bagel";
import { XMLBuilder } from "fast-xml-parser";

import { CertificateP12 } from "@/certificate";
import { NFE_TEST_DATA } from "@/dfe/nfe/layout/misc";
import { getWebServiceUrl } from "@/dfe/nfe/webServiceUrls";

import { NfeWebServices } from ".";
import { NfeServiceRequestError } from "./errors";

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
  const certificate = await CertificateP12.fromFilepath({
    filepath: "misc/sample-certificates/cert.pfx",
    password: "senha",
  });
  const uf = "DF";
  const env = "homologacao";
  const service = new NfeWebServices({ uf, env, certificate });

  // NOTE: Não lembro o motivo desse mock mas precisei desativar para a a autorização funcionar, estou considerando apagar
  // beforeEach(() => {
  //   spyOn(certificate, "asPem").mockReturnValueOnce({ cert: "", key: "" });
  // });

  afterEach(() => {
    clearMocks();
  });

  describe("statusServico", () => {
    const url = getWebServiceUrl({ uf, env, service: "NfeStatusServico" });

    test("Returns status success", async () => {
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

    test("Request throw NfeServiceRequestError", () => {
      mock(url, {
        method: "POST",
        throw: new Error("An error occurred during the request."),
      });

      expect(() => service.statusServico()).toThrowError(
        NfeServiceRequestError,
      );
    });
  });

  describe("consultaCadastro", () => {
    const url = getWebServiceUrl({ uf, env, service: "NfeConsultaCadastro" });

    test("Returns valid response", async () => {
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

  describe("autorizacao", () => {
    const url = getWebServiceUrl({ uf, env, service: "NFeAutorizacao" });

    test("Returns valid response", async () => {
      const mockResponse = {
        nfeResultMsg: {
          retEnviNFe: {
            cStat: "100",
            xMotivo: "Autorizado o uso da NF-e",
            cUF: "53",
            infRec: {
              nRec: "123456789",
              tMed: "1",
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

      const raw = mockResponse.nfeResultMsg.retEnviNFe;
      expect(
        await service.autorizacao({
          idLote: "1",
          nfe: NFE_TEST_DATA,
        }),
      ).toMatchObject({
        status: "uso-autorizado",
        description: raw.xMotivo,
        raw,
      });
    });
  });
});
