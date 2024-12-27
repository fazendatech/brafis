import {
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
  spyOn,
  mock,
} from "bun:test";
import { mock as mockRequest, clearMocks } from "bun-bagel";
import { XMLBuilder } from "fast-xml-parser";

import { CertificateP12 } from "@/certificate";
import { NFE_TEST_DATA } from "@/dfe/nfe/layout/misc";
import { getWebServiceUrl } from "@/dfe/nfe/webServiceUrls";

import { NfeWebServices } from ".";
import { NfeServiceRequestError } from "./errors";
import { ZodError } from "zod";

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
  const certificate = new CertificateP12({
    pfx: new Uint8Array(),
    password: "",
  });

  const uf = "DF";
  const env = "homologacao";
  const service = new NfeWebServices({ uf, env, certificate });

  beforeEach(() => {
    spyOn(certificate, "asPem").mockReturnValueOnce({ cert: "", key: "" });
  });

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
      mockRequest(url, {
        method: "POST",
        response: {
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

    test("Request throws NfeServiceRequestError on status not success", () => {
      mockRequest(url, {
        method: "POST",
        response: {
          status: 403,
        },
      });

      expect(() => service.statusServico()).toThrowError(
        // NOTE: Não existe atributo `MockResponse.statusText` no bun-bagel
        new NfeServiceRequestError(`403 (403) - ${url}`),
      );
    });

    test("Request throws NfeServiceRequestError on `nfeResultMsg` not present in response", () => {
      mockRequest(url, {
        method: "POST",
        response: {
          data: "request failed",
        },
      });

      expect(() => service.statusServico()).toThrowError(
        new NfeServiceRequestError(`URL: ${url}\nrequest failed`),
      );
    });

    test("Request throws error on timeout", () => {
      mockRequest(url, {
        method: "POST",
        throw: new Error("The operation timed out."),
      });

      expect(() => service.statusServico()).toThrowError(
        "The operation timed out.",
      );
    });

    test("Request throws NfeServiceRequestError on generic error", () => {
      mockRequest(url, {
        method: "POST",
        throw: new Error("An error occurred during the request."),
      });

      expect(() => service.statusServico()).toThrowError(
        new NfeServiceRequestError("An error occurred during the request."),
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
      mockRequest(url, {
        method: "POST",
        response: {
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
      mock.module("../sign", () => ({
        signNfe: () =>
          "<NFe><infNFe>mock nfe</infNFe><Signature>mock signature</Signature></NFe>",
      }));
      mockRequest(url, {
        method: "POST",
        response: {
          data: buildMockResponse({
            nfeResultMsg: {
              retEnviNFe: {
                cStat: "104",
                xMotivo: "Lote processado",
                protNFe: {
                  "@_versao": "4.00",
                  infProt: {
                    tpAmb: "2",
                    verAplic: "SVRS202101041234",
                    chNFe: "0".repeat(44),
                    dhRecbto: "2021-01-04T12:34:56-03:00",
                    nProt: "123456789012345",
                    digVal: "123456789012345",
                    cStat: "100",
                    xMotivo: "Autorizado o uso da NF-e",
                  },
                },
              },
            },
          }),
        },
      });

      expect(
        await service.autorizacao({
          idLote: "1",
          nfe: NFE_TEST_DATA,
        }),
      ).toMatchSnapshot();
    });

    test("Webservice throws Zod.ZodError for an invalid NFe", () => {
      const nfe = NFE_TEST_DATA;
      nfe.NFe.infNFe.ide.cUF = "invalid";

      expect(() => service.autorizacao({ idLote: "1", nfe })).toThrowError(
        ZodError,
      );
    });
  });
});
