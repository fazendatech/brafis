import { zCustom } from "@/utils/zCustom";
import { z } from "zod";
import { zUf } from "./misc";

const schemaNfeRetirada = z
  .object({
    CNPJ: zCustom.cnpj().optional().describe("F02"),
    CPF: zCustom.cpf().optional().describe("F02a"),
    xNome: zCustom.length(2, 60).optional().describe("F02b"),
    xLgr: zCustom.length(2, 60).describe("F03"),
    nro: zCustom.length(1, 60).describe("F04"),
    xCpl: zCustom.length(1, 60).optional().describe("F05"),
    xBairro: zCustom.length(2, 60).describe("F06"),
    cMun: zCustom.numeric().length(7).describe("F07"),
    xMun: zCustom.length(2, 60).describe("F08"),
    UF: zUf().or(z.literal("EX")).describe("F09"),
    CEP: zCustom.numeric().length(8).optional().describe("F10"),
    cPais: zCustom.numeric().length(4).optional().describe("F11"),
    xPais: zCustom.length(2, 60).optional().describe("F12"),
    fone: zCustom.phone().optional().describe("F13"),
    email: zCustom.length(1, 60).email().optional().describe("F14"),
    IE: zCustom.ie().optional().describe("F15"),
  })
  .refine(({ CNPJ, CPF }) => zCustom.utils.hasOnlyOne(CNPJ, CPF), {
    message: "Deve ser informado apenas um dos campos: CNPJ ou CPF.",
  })
  .refine(
    ({ cMun, xMun, UF }) => {
      if (cMun === "9999999" && xMun === "EXTERIOR" && UF === "EX") {
        return true;
      }
      if (cMun !== "9999999" && xMun !== "EXTERIOR" && UF !== "EX") {
        return true;
      }
      return false;
    },
    {
      message:
        "Se a operação for no exterior, informar cMun = '9999999', xMun = 'EXTERIOR' e UF = 'EX'.",
    },
  )
  .describe("retirada:F01");

/**
 * @description Grupo F. Identificação do Local de Retirada
 */
type NfeRetirada = z.infer<typeof schemaNfeRetirada>;

export { schemaNfeRetirada, type NfeRetirada };
