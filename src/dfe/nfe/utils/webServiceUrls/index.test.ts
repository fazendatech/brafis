import { getWebServiceUrl } from ".";
import { describe, test, expect } from "bun:test";
import { WebServiceNotFoundError } from "@/dfe/nfe/errors";

describe("getWebServiceUrl", () => {
  test("should return correct url for NFeDistribuicaoDFe service", () => {
    expect(
      getWebServiceUrl({
        uf: "MG",
        service: "NFeDistribuicaoDFe",
        env: "producao",
      }),
    ).toBe(
      "https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx",
    );
  });

  test("should return the correct URL", () => {
    expect(
      getWebServiceUrl({
        uf: "MG",
        service: "NfeStatusServico",
        env: "producao",
      }),
    ).toBe("https://nfe.fazenda.mg.gov.br/nfe2/services/NFeStatusServico4");
  });

  test("should return the correct URL in contingency", () => {
    expect(
      getWebServiceUrl({
        uf: "MG",
        service: "NfeStatusServico",
        env: "producao",
        contingency: true,
      }),
    ).toBe(
      "https://www.sefazvirtual.fazenda.gov.br/NFeStatusServico4/NFeStatusServico4.asmx",
    );
  });

  test("should throw an error if the web service is not found", () => {
    expect(() =>
      getWebServiceUrl({
        uf: "AM",
        service: "NfeConsultaCadastro",
        env: "producao",
      }),
    ).toThrowError(WebServiceNotFoundError);
  });
});
