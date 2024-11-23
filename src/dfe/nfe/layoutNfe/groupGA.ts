import { z } from "zod";
import { zCustom } from "@/utils/zCustom";

const schemaNfeAutXml = z
  .object({
    CNPJ: zCustom.string.cnpj().optional().describe("GA02"), // CNPJ autorizado a acessar o XML
    CPF: zCustom.string.cpf().optional().describe("GA03"), // CPF autorizado a acessar o XML
  })
  .refine(({ CNPJ, CPF }) => zCustom.utils.hasOnlyOne([CNPJ, CPF]), {
    message: "Deve ser informado apenas um dos campos: CNPJ, CPF",
  })
  .describe("autXML:GA01");

/**
 * @description Grupo GA. Autorização para obter XML
 */
type NfeAutXml = z.infer<typeof schemaNfeAutXml>;

export { schemaNfeAutXml, type NfeAutXml };
