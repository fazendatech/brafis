import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUf } from ".";

const schemaNfeEntrega = z
  .object({
    CNPJ: zCustom.string.cnpj().optional().describe("G02"),
    CPF: zCustom.string.cpf().optional().describe("G02a"),
    xNome: zCustom.string.range(2, 60).optional().describe("G02b"),
    xLgr: zCustom.string.range(2, 60).describe("G03"),
    nro: zCustom.string.range(1, 60).describe("G04"),
    xCpl: zCustom.string.range(1, 60).optional().describe("G05"),
    xBairro: zCustom.string.range(2, 60).describe("G06"),
    cMun: zCustom.string.numeric().length(7).describe("G07"),
    xMun: zCustom.string.range(2, 60).describe("G08"),
    UF: zUf().or(z.literal("EX")).describe("G09"),
    CEP: zCustom.string.numeric().length(8).optional().describe("G10"),
    cPais: zCustom.string.numeric().length(4).optional().describe("G11"), // Utilizar a Tabela do BACEN (Seção 8.3 do MOC – Visão Geral,Tabela de UF, Município e País).
    xPais: zCustom.string.range(2, 60).optional().describe("G12"),
    fone: zCustom.string.phone().optional().describe("G13"),
    email: zCustom.string.range(1, 60).email().optional().describe("G14"),
    IE: zCustom.string.ie().optional().describe("G15"),
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
        "Se a operação for no exterior, informar cMun = '9999999', xMun = 'EXTERIOR' e UF = 'EX",
    },
  )
  .describe("entrega:G01");

/**
 * @description Grupo G. Identificação do Local de Entrega
 */
type NfeEntrega = z.infer<typeof schemaNfeEntrega>;

export { schemaNfeEntrega, type NfeEntrega };
