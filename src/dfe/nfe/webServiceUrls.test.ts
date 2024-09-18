import { getWebServiceUrl } from "@/dfe/nfe/webServiceUrls";
import { describe, test, expect } from "bun:test";

describe("getWebServiceUrl", () => {
  test("should return the correct URL for production environment", () => {
    expect(
      getWebServiceUrl({
        uf: "MA",
        service: "NfeInutilizacao",
        env: "production",
      }),
    ).toBe(
      "https://www.sefazvirtual.fazenda.gov.br/NFeInutilizacao4/NFeInutilizacao4.asmx",
    );
    expect(
      getWebServiceUrl({
        uf: "AC",
        service: "NfeConsultaCadastro",
        env: "production",
      }),
    ).toBe(
      "https://cad.svrs.rs.gov.br/ws/cadconsultacadastro/cadconsultacadastro4.asmx",
    );
    expect(
      getWebServiceUrl({
        uf: "AC",
        service: "NfeStatusServico",
        env: "production",
      }),
    ).toBe(
      "https://nfe.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx",
    );
  });

  test("should return the correct URL for QA environment", () => {
    expect(
      getWebServiceUrl({ uf: "AC", service: "NfeInutilizacao", env: "qa" }),
    ).toBe(
      "https://www.svc.fazenda.gov.br/NFeInutilizacao4/NFeInutilizacao4.asmx",
    );
    expect(
      getWebServiceUrl({
        uf: "AM",
        service: "NfeConsultaProtocolo",
        env: "qa",
      }),
    ).toBe("https://nfe.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx");
  });

  test("should throw an error if the web service is not found", () => {
    expect(() =>
      getWebServiceUrl({
        uf: "EX",
        service: "NfeInutilizacao",
        env: "production",
      }),
    ).toThrow("Web service not found for NfeInutilizacao/EX (production)");
  });
});
