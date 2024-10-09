import { getWebServiceUrl } from "@/dfe/nfe/webServiceUrls";
import { describe, test, expect } from "bun:test";
import { WebServiceNotFoundError } from "./errors.ts";

describe("getWebServiceUrl", () => {
  test("should return the correct URL for production environment", () => {
    expect(
      getWebServiceUrl({
        uf: "MA",
        service: "NfeInutilizacao",
        env: "produção",
        contingencia: false,
      }),
    ).toBe(
      "https://www.sefazvirtual.fazenda.gov.br/NFeInutilizacao4/NFeInutilizacao4.asmx",
    );
    expect(
      getWebServiceUrl({
        uf: "AC",
        service: "NfeConsultaCadastro",
        env: "produção",
        contingencia: false,
      }),
    ).toBe(
      "https://cad.svrs.rs.gov.br/ws/cadconsultacadastro/cadconsultacadastro4.asmx",
    );
    expect(
      getWebServiceUrl({
        uf: "AC",
        service: "NfeStatusServico",
        env: "produção",
        contingencia: false,
      }),
    ).toBe(
      "https://nfe.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx",
    );
  });

  test("should return the correct URL for contingency environment (SVC-AN)", () => {
    expect(
      getWebServiceUrl({
        uf: "MG",
        service: "NfeStatusServico",
        env: "produção",
        contingencia: true,
      }),
    ).toBe(
      "https://www.sefazvirtual.fazenda.gov.br/NFeStatusServico4/NFeStatusServico4.asmx",
    );

    expect(
      getWebServiceUrl({
        uf: "SP",
        service: "NFeAutorizacao",
        env: "produção",
        contingencia: true,
      }),
    ).toBe(
      "https://www.sefazvirtual.fazenda.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx",
    );

    expect(
      getWebServiceUrl({
        uf: "RS",
        service: "NfeConsultaProtocolo",
        env: "produção",
        contingencia: true,
      }),
    ).toBe(
      "https://www.sefazvirtual.fazenda.gov.br/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx",
    );
  });

  test("should return the correct URL for contingency environment (SVC-RS)", () => {
    expect(
      getWebServiceUrl({
        uf: "GO",
        service: "NFeAutorizacao",
        env: "produção",
        contingencia: true,
      }),
    ).toBe("https://nfe.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx");

    expect(
      getWebServiceUrl({
        uf: "BA",
        service: "NFeRetAutorizacao",
        env: "produção",
        contingencia: true,
      }),
    ).toBe(
      "https://nfe.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx",
    );
  });

  test("should return the correct URL for homologation environment", () => {
    expect(
      getWebServiceUrl({
        uf: "MT",
        service: "NfeStatusServico",
        env: "homologação",
        contingencia: false,
      }),
    ).toBe(
      "https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeStatusServico4?wsdl",
    );

    expect(
      getWebServiceUrl({
        uf: "MS",
        service: "NfeConsultaProtocolo",
        env: "homologação",
        contingencia: false,
      }),
    ).toBe("https://hom.nfe.sefaz.ms.gov.br/ws/NFeConsultaProtocolo4");

    expect(
      getWebServiceUrl({
        uf: "GO",
        service: "NfeInutilizacao",
        env: "homologação",
        contingencia: false,
      }),
    ).toBe(
      "https://homolog.sefaz.go.gov.br/nfe/services/NFeInutilizacao4?wsdl",
    );
  });

  test("should throw an error if the web service is not found", () => {
    expect(() =>
      getWebServiceUrl({
        uf: "PE",
        service: "NfeInutilizacao",
        env: "produção",
        contingencia: true,
      }),
    ).toThrowError(WebServiceNotFoundError);

    expect(() =>
      getWebServiceUrl({
        uf: "EX",
        service: "NfeInutilizacao",
        env: "homologação",
        contingencia: false,
      }),
    ).toThrowError(WebServiceNotFoundError);
  });
});
