import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUf } from ".";

const schemaNfeEntrega = z
  .object({
    CNPJ: zCustom.cnpj().optional().describe("G02"),
    CPF: zCustom.cpf().optional().describe("G02a"),
    xNome: zCustom.range(2, 60).optional().describe("G02b"),
    xLgr: zCustom.range(2, 60).describe("G03"),
    nro: zCustom.range(1, 60).describe("G04"),
    xCpl: zCustom.range(1, 60).optional().describe("G05"),
    xBairro: zCustom.range(2, 60).describe("G06"),
    cMun: zCustom.numeric().length(7).describe("G07"),
    xMun: zCustom.range(2, 60).describe("G08"),
    UF: zUf().or(z.literal("EX")).describe("G09"),
    CEP: zCustom.numeric().length(8).optional().describe("G10"),
    cPais: zCustom.numeric().length(4).optional().describe("G11"),
    xPais: zCustom.range(2, 60).optional().describe("G12"),
    fone: zCustom.phone().optional().describe("G13"),
    email: zCustom.range(1, 60).email().optional().describe("G14"),
    IE: zCustom.ie().optional().describe("G15"),
  })
  .refine(({ CNPJ, CPF }) => zCustom.hasOnlyOne(CNPJ, CPF), {
    message: "Deve ser informado apenas um dos campos: CNPJ ou CPF.",
  })
  .refine(
    ({ cMun, xMun, UF }) => {
      const isExterior =
        cMun === "9999999" && xMun === "EXTERIOR" && UF === "EX";
      const isNotExterior =
        cMun !== "9999999" && xMun !== "EXTERIOR" && UF !== "EX";
      return isExterior || isNotExterior;
    },
    {
      message:
        "Se a operação for no exterior, informar cMun = '9999999', xMun = 'EXTERIOR' e UF = 'EX'.",
    },
  )
  .describe("entrega:G01");

/**
 * @description Grupo G. Identificação do Local de Entrega
 */
type NfeEntrega = z.infer<typeof schemaNfeEntrega>;

export { schemaNfeEntrega, type NfeEntrega };
