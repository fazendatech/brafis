import { zCustom } from "@/utils/zCustom";
import { z } from "zod";

const schemaNfeAutXml = z
  .object({
    CNPJ: zCustom.cnpj().optional().describe("GA02"),
    CPF: zCustom.cpf().optional().describe("GA03"),
  })
  .refine(({ CNPJ, CPF }) => zCustom.utils.hasOnlyOne(CNPJ, CPF), {
    message: "Deve ser informado apenas um dos campos: CNPJ, CPF",
  })
  .describe("autXML:GA01");

/**
 * @description Grupo GA. Autorização para obter XML
 */
type NfeAutXml = z.infer<typeof schemaNfeAutXml>;

export { schemaNfeAutXml, type NfeAutXml };
