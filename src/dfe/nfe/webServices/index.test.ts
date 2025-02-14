import {
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";
import { CertificateP12 } from "@/certificate";
import { NFE_TEST_DATA } from "@/dfe/nfe/layout/misc";
import { getWebServiceUrl } from "@/dfe/nfe/webServiceUrls";
import { clearMocks, mock as mockRequest } from "bun-bagel";
import { XMLBuilder } from "fast-xml-parser";
import { ZodError } from "zod";
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

function mockCertificateSignXml(signedObject: unknown) {
  mock.module("src/certificate/sign", () => ({
    signXml: () => signedObject,
  }));
}

describe("NfeWebServices", async () => {
  const certificate = new CertificateP12({
    pfx: Buffer.from(""),
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

      expect(await service.statusServico()).toMatchObject({
        nfeResultMsg: {
          retConsStatServ: {
            cStat: "107",
            cUF: "53",
            tpAmb: "2",
            xMotivo: "Servico em Operacao",
          },
        },
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
              infCad: [
                {
                  IE: "123456789",
                },
              ],
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

      expect(await service.consultaCadastro({})).toMatchObject({
        nfeResultMsg: {
          retConsCad: {
            infCons: {
              cStat: "111",
              infCad: [
                {
                  IE: "123456789",
                },
              ],
              xMotivo: "Consulta cadastro com uma ocorrência",
            },
          },
        },
      });
    });
  });

  describe("autorizacao", () => {
    const url = getWebServiceUrl({ uf, env, service: "NFeAutorizacao" });

    test("Returns valid response", async () => {
      mockCertificateSignXml({
        NFe: { infNFe: "mock NFe", Signature: "mock signature" },
      });

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

    test("Webservice throws ZodError for an invalid NFe", () => {
      const nfe = NFE_TEST_DATA;
      nfe.NFe.infNFe.ide.cUF = "invalid";

      expect(() => service.autorizacao({ idLote: "1", nfe })).toThrowError(
        ZodError,
      );
    });
  });

  describe("inutilizacao", () => {
    const url = getWebServiceUrl({ uf, env, service: "NfeInutilizacao" });

    test("Returns valid response", async () => {
      mockCertificateSignXml({
        inutNfe: { infInut: "mock infInut", Signature: "mock signature" },
      });

      mockRequest(url, {
        method: "POST",
        response: {
          data: buildMockResponse({
            nfeResultMsg: {
              retInutNFe: {
                infInut: {
                  cStat: "102",
                  xMotivo: "Inutilização de número homologado",
                  cUF: "53",
                  nProt: "123456789",
                  dhRecbto: "2021-01-01T00:00:00-03:00",
                },
              },
            },
          }),
        },
      });

      expect(
        await service.inutilizacao({
          ano: "2021",
          CNPJ: "12345678901230",
          mod: "55",
          serie: "1",
          nNFIni: "1",
          nNFFin: "10",
          xJust: "justificativa",
        }),
      ).toMatchSnapshot();
    });

    test("Webservice throws ZodError for an invalid CNPJ", () => {
      expect(() =>
        service.inutilizacao({
          ano: "2021",
          CNPJ: "12345678901231",
          mod: "55",
          serie: "1",
          nNFIni: "1",
          nNFFin: "10",
          xJust: "justificativa",
        }),
      ).toThrowError(ZodError);
    });
  });

  describe("recepcaoEvento", () => {
    const url = getWebServiceUrl({ uf, env, service: "RecepcaoEvento" });

    test("Returns valid response", async () => {
      mockCertificateSignXml({
        evento: {
          "@_versao": "1.00",
          infEvento: { detEvento: "Mock detEvento" },
          Signature: "mock signature",
        },
      });

      mockRequest(url, {
        method: "POST",
        response: {
          data: buildMockResponse({
            nfeResultMsg: {
              retEnvEvento: {
                "@_versao": "1.00",
                idLote: "1",
                tpAmb: "2",
                verAplic: "SVRS202101041234",
                cOrgao: "91",
                cStat: "128",
                xMotivo: "Lote processado",
                retEvento: {
                  "@_versao": "1.00",
                  infEvento: {
                    "@_Id": "ID123",
                    tpEvento: "110110",
                    xEvento: "Carta de Correção aplicada",
                    cStat: "135",
                    xMotivo: "Evento registrado e vinculado a NF-e",
                    chNFe: "0".repeat(44),
                    dhRegEvento: "2025-01-01T00:00:00-03:00",
                    nProt: "123456789",
                  },
                },
              },
            },
          }),
        },
      });

      expect(
        await service.recepcaoEvento({
          idLote: "1",
          CNPJ: "12345678901230",
          dhEvento: "2025-01-01T00:00:00-03:00",
          nSeqEvento: "1",
          chNFe: "0".repeat(44),
          detEvento: {
            descEvento: "Carta de Correção",
            xCorrecao: "correção",
          },
        }),
      ).toMatchSnapshot();
    });

    test("Webservice throws ZodError for an invalid CPF", () => {
      expect(() =>
        service.recepcaoEvento({
          idLote: "1",
          CPF: "12345678999",
          dhEvento: "2025-01-01T00:00:00-03:00",
          nSeqEvento: "1",
          chNFe: "0".repeat(44),
          detEvento: {
            descEvento: "Carta de Correção",
            xCorrecao: "correção",
          },
        }),
      ).toThrowError(ZodError);
    });

    test("Webservice throws ZodError for an invalid CNPJ", () => {
      expect(() =>
        service.recepcaoEvento({
          idLote: "1",
          CNPJ: "12345678901299",
          dhEvento: "2025-01-01T00:00:00-03:00",
          nSeqEvento: "1",
          chNFe: "0".repeat(44),
          detEvento: {
            descEvento: "Carta de Correção",
            xCorrecao: "correção",
          },
        }),
      ).toThrowError(ZodError);
    });
  });

  describe("consultaProtocolo", () => {
    const url = getWebServiceUrl({ uf, env, service: "NfeConsultaProtocolo" });

    test("Returns valid response", async () => {
      mockRequest(url, {
        method: "POST",
        response: {
          data: buildMockResponse({
            nfeResultMsg: {
              retConsSitNFe: {
                tpAmb: "2",
                cStat: "100",
                xMotivo: "Autorizado o uso da NF-e",
                cUF: "53",
                chNFe: "0".repeat(44),
                protNFe: {
                  infProt: {
                    tpAmb: "2",
                    chNFe: "0".repeat(44),
                    nProt: "123456789012345",
                    digVal: "123456789012345",
                    cStat: "100",
                    xMotivo: "Autorizado o uso da NF-e",
                  },
                },
                procEventoNFe: [
                  { evento: "mock evento", retEvento: "mock ret" },
                ],
              },
            },
          }),
        },
      });
      expect(
        await service.consultaProtocolo({ chNFe: "0".repeat(44) }),
      ).toMatchSnapshot();
    });
  });

  describe("distribuicaoDfe", () => {
    const url = getWebServiceUrl({ uf, env, service: "NFeDistribuicaoDFe" });

    test("Returns valid response", async () => {
      mockRequest(url, {
        method: "POST",
        response: {
          data: buildMockResponse({
            nfeDistDFeInteresseResponse: {
              nfeDistDFeInteresseResult: {
                retDistDFeInt: {
                  tpAmb: "2",
                  cStat: "138",
                  xMotivo: "Documento localizado",
                  dhResp: "2025-01-24T08:00:00-03:00",
                  ultNSU: "0",
                  maxNSU: "0",
                  loteDistDFeInt: {
                    "@_NSU": "0",
                    "@_schema": "resNFe_v1.00.xsd",
                    docZip: "NFe compactada no padrão gZip",
                  },
                },
              },
            },
          }),
        },
      });
      expect(
        await service.distribuicaoDfe({
          CNPJ: "12345678901230",
          consChNFe: {
            chNFe: "0".repeat(44),
          },
        }),
      ).toMatchSnapshot();
    });

    test("Webservice throws ZodError for an invalid CPF", () => {
      expect(() =>
        service.distribuicaoDfe({
          CPF: "12345678999",
          consChNFe: {
            chNFe: "0".repeat(44),
          },
        }),
      ).toThrowError(ZodError);
    });

    test("Webservice throws ZodError for an invalid CNPJ", () => {
      expect(() =>
        service.distribuicaoDfe({
          CNPJ: "12345678901299",
          consChNFe: {
            chNFe: "0".repeat(44),
          },
        }),
      ).toThrowError(ZodError);
    });
  });
});
