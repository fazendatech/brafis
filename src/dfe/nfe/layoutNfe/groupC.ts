import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUf } from ".";

const schemaNfeEmit = z
  .object({
    CNPJ: zCustom.string.cnpj().optional().describe("C02"),
    CPF: zCustom.string.cpf().optional().describe("C02a"),
    xNome: zCustom.string.range(2, 60).describe("C03"),
    xFant: zCustom.string.range(1, 60).describe("C04"),
    enderEmit: z
      .object({
        xLgr: zCustom.string.range(2, 60).describe("C06"),
        nro: zCustom.string.range(1, 60).describe("C07"),
        xCpl: zCustom.string.range(1, 60).optional().describe("C08"),
        xBairro: zCustom.string.range(2, 60).describe("C09"),
        cMun: zCustom.string.numeric().length(7).describe("C10"),
        xMun: zCustom.string.range(2, 60).describe("C11"),
        UF: zUf().describe("C12"), // UF
        CEP: zCustom.string.numeric().length(8).optional().describe("C13"),
        cPais: zCustom.string.numeric().length(4).optional().describe("C14"),
        xPais: zCustom.string.range(2, 60).optional().describe("C15"),
        fone: zCustom.string.phone().optional().describe("C16"),
      })
      .refine(
        ({ cPais, xPais }) => {
          if (cPais === "1058") {
            return xPais === "BRASIL" || xPais === "Brasil";
          }
          return true;
        },
        { message: "Para cPais='1058', xPais deve ser 'BRASIL' ou 'Brasil'" },
      )
      .describe("C05"),
    IE: zCustom.string.ie().describe("C17"),
    IEST: zCustom.string.ie().optional().describe("C18"),
    IM: zCustom.string.range(1, 15).optional().describe("C19"),
    CNAE: zCustom.string.numeric().length(7).optional().describe("C20"),
    CRT: z.enum(["1", "2", "3"]).describe("C21"),
  })
  .refine(({ CNPJ, CPF }) => zCustom.utils.hasOnlyOne([CNPJ, CPF]), {
    message: "Deve ser informado apenas um dos campos: CNPJ ou CPF.",
  })
  .refine(
    ({ CNAE, IM }) => {
      if (CNAE && !IM) {
        return false;
      }
      return true;
    },
    {
      message: "Se informado CNAE então é necessário informar IM.",
    },
  )
  .describe("emit:C01");

/**
 * @description Grupo C. Identificação do Emitente da Nota Fiscal eletrônica
 */
type NfeEmit = z.infer<typeof schemaNfeEmit>;

export { schemaNfeEmit, type NfeEmit };
