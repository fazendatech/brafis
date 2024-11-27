import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUf } from ".";

const schemaNfeTransp = z
  .object({
    modFrete: z.enum(["0", "1", "2", "3", "4", "9"]).describe("X02"),
    transporta: z
      .object({
        CNPJ: zCustom.cnpj().optional().describe("X04"),
        CPF: zCustom.cpf().optional().describe("X05"),
        xNome: zCustom.length(2, 60).optional().describe("X06"),
        IE: zCustom.ie().or(z.literal("ISENTO")).optional().describe("X07"),
        xEnder: zCustom.length(1, 60).optional().describe("X08"),
        xMun: zCustom.length(1, 60).optional().describe("X09"),
        UF: zUf().optional().describe("X10"),
      })
      .refine(({ CNPJ, CPF }) => zCustom.hasOnlyOne(CNPJ, CPF), {
        message: "Deve ser informado apenas um CNPJ ou CPF",
      })
      .refine(
        ({ IE, UF }) => {
          if (IE && !UF) {
            return false;
          }
          return true;
        },
        {
          message: "UF é obrigatório quando informado uma IE",
        },
      )
      .describe("X03")
      .optional(),
    retTransp: z
      .object({
        vServ: zCustom.decimal(13, 2).describe("X12"),
        vBCRet: zCustom.decimal(13, 2).describe("X13"),
        pICMSRet: zCustom.decimal(3, 4).describe("X14"),
        vICMSRet: zCustom.decimal(13, 2).describe("X15"),
        CFOP: zCustom.numeric().length(4).describe("X16"),
        cMunFG: zCustom.numeric().length(7).describe("X17"),
      })
      .optional()
      .describe("X11"),
    veicTransp: z
      .object({
        placa: zCustom.placa().describe("X19"),
        UF: zUf().or(z.literal("EX")).describe("X20"),
        RNTC: zCustom.length(1, 20).optional().describe("X21"),
      })
      .optional()
      .describe("X18"),
    reboque: z
      .array(
        z.object({
          placa: zCustom.length(7, 7).describe("X23"),
          UF: zUf().or(z.literal("EX")).describe("X24"),
          RNTC: zCustom.length(1, 20).optional().describe("X25"),
        }),
      )
      .max(5)
      .optional()
      .describe("X22"),
    vagao: zCustom.length(1, 20).optional().describe("X25a"),
    balsa: zCustom.length(1, 20).optional().describe("X25b"),
    vol: z
      .array(
        z.object({
          qVol: zCustom.numeric().max(15).optional().describe("X27"),
          esp: zCustom.length(1, 60).optional().describe("X28"),
          marca: zCustom.length(1, 60).optional().describe("X29"),
          nVol: zCustom.length(1, 60).optional().describe("X30"),
          pesoL: zCustom.decimal(12, 3).optional().describe("X31"),
          pesoB: zCustom.decimal(12, 3).optional().describe("X32"),
          lacres: z
            .array(z.object({ nLacre: zCustom.length(1, 60).describe("X34") }))
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
