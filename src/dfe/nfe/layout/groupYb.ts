import { zCustom } from "@/utils/zCustom";
import { z } from "zod";

const schemaNfeInfIntermed = z
  .object({
    CNPJ: zCustom.cnpj().describe("YB02"),
    idCadIntTran: z.string().length(60).describe("YB03"),
  })
  .describe("infIntermed:YB01");

/**
 * @description Grupo YB. Informações do Intermediador da Transação
 */
type NfeInfIntermed = z.infer<typeof schemaNfeInfIntermed>;

export { schemaNfeInfIntermed, type NfeInfIntermed };
