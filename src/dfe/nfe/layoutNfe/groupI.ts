import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { schemaNfeDi } from "./groupI01";
import { schemaNfeDetExport } from "./groupI03";
import { schemaNfeRastro } from "./groupI80";

const schemaNfeProd = z
  .object({
    cProd: zCustom.string.range(1, 60).describe("I02"),
    cEAN: zCustom.string
      .numeric()
      .or(z.literal("SEM GTIN"))
      .refine(
        (value) => {
          const validSize = [0, 8, 12, 13, 14];
          return validSize.includes(value.length);
        },
        {
          message:
            "GTIN inválido. O campo cEAN deve ter 0, 8, 12, 13 ou 14 caracteres.",
        },
      )
      .describe("I03"),
    xProd: zCustom.string.range(1, 120).describe("I04"),
    NCM: zCustom.string.numeric().length(8).or(z.literal("00")).describe("I05"),
    NVE: z.array(z.string().length(6)).max(8).optional().describe("I05a"),
    // I05b
    CEST: zCustom.string.numeric().length(7).optional().describe("I05c"),
    indEscala: z.enum(["S", "N"]).optional().describe("I05d"),
    CNPJFab: zCustom.string.cnpj().optional().describe("I05e"),
    // END I05b
    cBenef: z
      .string()
      .refine(
        (value) => {
          const validSize = [8, 10];
          return validSize.includes(value.length);
        },
        { message: "O campo cBenef deve ter 8 ou 10 caracteres." },
      )
      .optional()
      .describe("I05f"),
    EXTIPI: zCustom.string.numeric().min(2).max(3).optional().describe("I06"),
    CFOP: zCustom.string.numeric().length(4).describe("I08"),
    uCom: zCustom.string.range(1, 6).describe("I09"),
    qCom: zCustom.string.decimal(11, 4).describe("I10"),
    vUnCom: zCustom.string.decimal(11, 10).describe("I10a"),
    vProd: zCustom.string.decimal(13, 2).describe("I11"),
    cEANTrib: zCustom.string.range(8, 14).optional().describe("I12"),
    uTrib: zCustom.string.range(1, 6).describe("I13"),
    qTrib: zCustom.string.decimal(11, 4).describe("I14"),
    vUnTrib: zCustom.string.decimal(11, 10).describe("I14a"),
    vFrete: zCustom.string.decimal(13, 2).optional().describe("I15"),
    vSeg: zCustom.string.decimal(13, 2).optional().describe("I16"),
    vDesc: zCustom.string.decimal(13, 2).optional().describe("I17"),
    vOutro: zCustom.string.decimal(13, 2).optional().describe("I17a"),
    indTot: z.enum(["0", "1"]).describe("I17b"),
    DI: z.array(schemaNfeDi).min(1).max(100).optional().describe("I18"),
    detExport: z
      .array(schemaNfeDetExport)
      .min(1)
      .max(500)
      .optional()
      .describe("I50"),
    // Group I05
    xPed: zCustom.string.range(1, 15).optional().describe("I60"),
    nItemPed: zCustom.string.numeric().length(6).optional().describe("I61"),
    // Group I07
    nFCI: z.string().length(36).optional().describe("I70"), // Informação relacionada com a Resolução 13/2012 do Senado Federal. Formato: Algarismos, letras maiúsculas de "A" a "F" e o caractere hífen. Exemplo: B01F70AF-10BF4B1F-848C-65FF57F616FE
    rastro: z.array(schemaNfeRastro).min(1).max(500).optional().describe("I80"),
  })
  .refine(
    ({ indEscala, CNPJFab, CEST }) => (indEscala || CNPJFab ? !!CEST : true),
    {
      message:
        "Se informado indEscala ou CNPJFab, então CEST precisa ser ser informado",
    },
  ) // Grupo Opcional (I05b)
  .describe("prod:I01");

/**
 * @description Grupo I. Produtos e Serviços da NF-e
 */
type NfeProd = z.infer<typeof schemaNfeProd>;

export { schemaNfeProd, type NfeProd };
