import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

import { zUf } from "./GroupC";

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
  .refine(
    (obj) =>
      zCustom.utils.hasOnlyOne([obj.CNPJ, obj.CPF]) &&
      (obj.cMun === "9999999" || obj.xMun === "EXTERIOR" || obj.UF === "EX"
        ? obj.cMun === "9999999" && obj.xMun === "EXTERIOR" && obj.UF === "EX"
        : true),
  )
  .describe("retirada:F01");

type NfeRetirada = z.infer<typeof schemaNfeRetirada>;

/**
 * @description Grupo F. Identificação do Local de Retirada
 */
export { schemaNfeRetirada, type NfeRetirada };
