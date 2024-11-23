import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUf } from ".";

const schemaNfeRetirada = z
  .object({
    CNPJ: zCustom.string.cnpj().optional().describe("F02"),
    CPF: zCustom.string.cpf().optional().describe("F02a"),
    xNome: zCustom.string.range(2, 60).optional().describe("F02b"),
    xLgr: zCustom.string.range(2, 60).describe("F03"),
    nro: zCustom.string.range(1, 60).describe("F04"),
    xCpl: zCustom.string.range(1, 60).optional().describe("F05"),
    xBairro: zCustom.string.range(2, 60).describe("F06"),
    cMun: zCustom.string.numeric().length(7).describe("F07"),
    xMun: zCustom.string.range(2, 60).describe("F08"),
    UF: zUf().or(z.literal("EX")).describe("F09"),
    CEP: zCustom.string.numeric().length(8).optional().describe("F10"),
    cPais: zCustom.string.numeric().length(4).optional().describe("F11"), // Utilizar a Tabela do BACEN (Seção 8.3 do MOC – Visão Geral,Tabela de UF, Município e País).
    xPais: zCustom.string.range(2, 60).optional().describe("F12"),
    fone: zCustom.string.phone().optional().describe("F13"),
    email: zCustom.string.range(1, 60).email().optional().describe("F14"),
    IE: zCustom.string.ie().optional().describe("F15"),
  })
  .refine(({ CNPJ, CPF }) => zCustom.utils.hasOnlyOne([CNPJ, CPF]), {
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
        "Se a operação for no exterior, informar cMun = '9999999', xMun = 'EXTERIOR' e UF = 'EX'",
    },
  )
  .describe("retirada:F01");

/**
 * @description Grupo F. Identificação do Local de Retirada
 */
type NfeRetirada = z.infer<typeof schemaNfeRetirada>;

export { schemaNfeRetirada, type NfeRetirada };
