import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUfCode } from ".";

const schemaNfeNfRef = z
  .object({
    refNfe: zCustom.string.numeric().length(44).optional().describe("BA02"),
    refNF: z
      .object({
        cUF: zUfCode().describe("BA04"),
        AAMM: zCustom.string
          .numeric()
          .length(4)
          .refine(
            (value) => {
              const month = Number.parseInt(value.slice(2, 4));
              return month >= 1 && month <= 12;
            },
            { message: "Mês deve ser entre 01 e 12." },
          )
          .describe("BA05"),
        CNPJ: zCustom.string.cnpj().describe("BA06"),
        mod: z.enum(["01", "02"]).describe("BA07"),
        serie: zCustom.string.numeric().min(1).max(3).describe("BA08"),
        nNF: zCustom.string
          .numeric()
          .min(1)
          .max(9)
          .refine((value) => Number(value) > 0)
          .describe("BA09"),
      })
      .optional()
      .describe("BA03"),
    refNFP: z
      .object({
        cUF: zUfCode().describe("BA11"),
        AAMM: zCustom.string
          .numeric()
          .length(4)
          .refine(
            (value) => {
              const month = Number.parseInt(value.slice(2, 4));
              return month >= 1 && month <= 12;
            },
            { message: "Mês deve ser entre 01 e 12." },
          )
          .describe("BA12"),
        CNPJ: zCustom.string.cnpj().optional().describe("BA13"),
        CPF: zCustom.string.cpf().optional().describe("BA14"),
        IE: zCustom.string.ie().describe("BA15"),
        mod: z.enum(["01", "04"]).describe("BA16"),
        serie: zCustom.string.numeric().min(1).max(3).describe("BA17"),
        nNF: zCustom.string
          .numeric()
          .min(1)
          .max(9)
          .refine((value) => Number(value) > 0)
          .describe("BA18"),
      })
      .refine(({ CNPJ, CPF }) => zCustom.utils.hasOnlyOne([CNPJ, CPF]), {
        message: "Deve ser informado apenas um dos campos: CNPJ ou CPF.",
      })
      .optional()
      .describe("BA10"),
    refCTe: zCustom.string.numeric().length(44).optional().describe("BA19"),
    refECF: z
      .object({
        mod: z.enum(["2B", "2C", "2D"]).describe("BA21"),
        nECF: zCustom.string.numeric().length(3).describe("BA22"),
        nCOO: zCustom.string.numeric().length(6).describe("BA23"),
      })
      .optional()
      .describe("BA20"),
  })
  .refine(
    ({ refNfe, refNF, refNFP, refCTe, refECF }) =>
      zCustom.utils.hasOnlyOne([refNfe, refNF, refNFP, refCTe, refECF]),
    {
      message:
        "Informe apenas uma das referências: refNfe, refNF, refNFP, refCTe ou refECF.",
    },
  )
  .describe("NFref:BA01");

/**
 * @description Grupo BA. Documento Fiscal Referenciado
 */
type NfeNfRef = z.infer<typeof schemaNfeNfRef>;

export { schemaNfeNfRef, type NfeNfRef };