import { z } from "zod";

import { zCustom } from "@/utils/zCustom";
import { zUf } from ".";

const schemaNfeTransp = z
  .object({
    modFrete: z.enum(["0", "1", "2", "3", "4", "9"]).describe("X02"),
    transporta: z
      .object({
        CNPJ: zCustom.string.cnpj().optional().describe("X04"),
        CPF: zCustom.string.cpf().optional().describe("X05"),
        xNome: zCustom.string.range(2, 60).optional().describe("X06"),
        IE: zCustom.string
          .ie()
          .or(z.literal("ISENTO"))
          .optional()
          .describe("X07"),
        xEnder: zCustom.string.range(1, 60).optional().describe("X08"),
        xMun: zCustom.string.range(1, 60).optional().describe("X09"),
        UF: zUf().optional().describe("X10"),
      })
      .refine(({ CNPJ, CPF }) => zCustom.utils.hasOnlyOne([CNPJ, CPF]), {
        message: "Deve ser informado apenas um CNPJ ou CPF",
      })
      .refine(({ IE, UF }) => !IE || UF, {
        message: "UF é obrigatório quando informado uma IE",
      })
      .describe("X03")
      .optional(),
    retTransp: z
      .object({
        vServ: zCustom.string.decimal().length(16).describe("X12"),
        vBCRet: zCustom.string.decimal().length(16).describe("X13"),
        pICMSRet: zCustom.string.decimal(2, 4).length(8).describe("X14"),
        vICMSRet: zCustom.string.decimal().length(16).describe("X15"),
        CFOP: zCustom.string.numeric().length(4).describe("X16"),
        cMunFG: zCustom.string.numeric().length(7).describe("X17"),
      })
      .optional()
      .describe("X11"),
    veicTransp: z
      .object({
        placa: z
          .string()
          .regex(/^(?:[A-Z]{3}[0-9]{3,4}|[A-Z]{2}[0-9]{4}|[A-Z]{4}[0-9]{3})$/, {
            message:
              "Formatos de placas válidas: XXX9999, XXX999, XX9999, or XXXX999. Informar a placa em informações complementares quando a placa do veículo tiver lei de formação diversa",
          })
          .describe("X19"),
        UF: zUf().or(z.literal("EX")).describe("X20"),
        RNTC: zCustom.string.range(1, 20).optional().describe("X21"),
      })
      .optional()
      .describe("X18"),
    reboque: z
      .array(
        z.object({
          placa: zCustom.string.range(7, 7).describe("X23"),
          UF: zUf().or(z.literal("EX")).describe("X24"),
          RNTC: zCustom.string.range(1, 20).optional().describe("X25"),
        }),
      )
      .max(5)
      .optional()
      .describe("X22"),
    vagao: zCustom.string.range(1, 20).optional().describe("X25a"),
    balsa: zCustom.string.range(1, 20).optional().describe("X25b"),
    vol: z
      .array(
        z.object({
          qVol: zCustom.string.numeric().max(15).optional().describe("X27"),
          esp: zCustom.string.range(1, 60).optional().describe("X28"),
          marca: zCustom.string.range(1, 60).optional().describe("X29"),
          nVol: zCustom.string.range(1, 60).optional().describe("X30"),
          pesoL: zCustom.string.decimal().length(16).optional().describe("X31"),
          pesoB: zCustom.string.decimal().length(16).optional().describe("X32"),
          lacres: z
            .array(
              z.object({ nLacre: zCustom.string.range(1, 60).describe("X34") }),
            )
            .max(5000)
            .optional()
            .describe("X33"),
        }),
      )
      .max(5000)
      .optional()
      .describe("X26"),
  })
  .describe("transp:X01");

/**
 * @description Grupo X. Informações do Transporte da NF-e
 */
type NfeTransp = z.infer<typeof schemaNfeTransp>;

export { schemaNfeTransp, type NfeTransp };
