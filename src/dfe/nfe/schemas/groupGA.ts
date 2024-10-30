import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

const schemaNfeAutXml = z
  .object({
    CNPJ: zCustom.string.cnpj().optional().describe("GA02"), // CNPJ autorizado a acessar o XML
    CPF: zCustom.string.cpf().optional().describe("GA03"), // CPF autorizado a acessar o XML
  })
  .refine((obj) => zCustom.utils.hasOnlyOne([obj.CNPJ, obj.CPF]))
  .describe("autXML:GA01");

type NfeAutXml = z.infer<typeof schemaNfeAutXml>;

/**
 * @description Grupo GA. Autorização para obter XML
 */
export { schemaNfeAutXml, type NfeAutXml };
