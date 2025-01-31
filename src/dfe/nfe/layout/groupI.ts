import { zCustom } from "@/utils/zCustom";
import { z } from "zod";
import { schemaNfeDi } from "./groupI01";
import { schemaNfeDetExport } from "./groupI03";
import { schemaNfeRastro } from "./groupI80";

const schemaNfeProd = z
  .object({
    cProd: zCustom.length(1, 60).describe("I02"),
    cEAN: zCustom
      .numeric()
      .or(z.literal("SEM GTIN"))
      .refine((value) => [0, 8, 12, 13, 14].includes(value.length), {
        message:
          "GTIN inválido. O campo cEAN deve ter 0, 8, 12, 13 ou 14 caracteres.",
      })
      .describe("I03"),
    xProd: zCustom.length(1, 120).describe("I04"),
    NCM: zCustom.numeric().length(8).or(z.literal("00")).describe("I05"),
    NVE: z.array(z.string().length(6)).max(8).optional().describe("I05a"),
    CEST: zCustom.numeric().length(7).optional().describe("I05c"),
    indEscala: z.enum(["S", "N"]).optional().describe("I05d"),
    CNPJFab: zCustom.cnpj().optional().describe("I05e"),
    cBenef: z
      .string()
      .refine((value) => [8, 10].includes(value.length), {
        message: "O campo cBenef deve ter 8 ou 10 caracteres.",
      })
      .optional()
      .describe("I05f"),
    EXTIPI: zCustom.numeric().min(2).max(3).optional().describe("I06"),
    CFOP: zCustom.numeric().length(4).describe("I08"),
    uCom: zCustom.length(1, 6).describe("I09"),
    qCom: zCustom.decimal(11, 4).describe("I10"),
    vUnCom: zCustom.decimal(11, 10).describe("I10a"),
    vProd: zCustom.decimal(13, 2).describe("I11"),
    cEANTrib: zCustom.length(8, 14).optional().describe("I12"),
    uTrib: zCustom.length(1, 6).describe("I13"),
    qTrib: zCustom.decimal(11, 4).describe("I14"),
    vUnTrib: zCustom.decimal(11, 10).describe("I14a"),
    vFrete: zCustom.decimal(13, 2).optional().describe("I15"),
    vSeg: zCustom.decimal(13, 2).optional().describe("I16"),
    vDesc: zCustom.decimal(13, 2).optional().describe("I17"),
    vOutro: zCustom.decimal(13, 2).optional().describe("I17a"),
    indTot: z.enum(["0", "1"]).describe("I17b"),
    DI: z.array(schemaNfeDi).min(1).max(100).optional().describe("I18"),
    detExport: z
      .array(schemaNfeDetExport)
      .min(1)
      .max(500)
      .optional()
      .describe("I50"),
    xPed: zCustom.length(1, 15).optional().describe("I60"),
    nItemPed: zCustom.numeric().length(6).optional().describe("I61"),
    nFCI: z.string().length(36).optional().describe("I70"),
    rastro: z.array(schemaNfeRastro).min(1).max(500).optional().describe("I80"),
  })
  .refine(
    ({ indEscala, CNPJFab, CEST }) => {
      if (indEscala || CNPJFab) {
        return !!CEST;
      }
      return true;
    },
    {
      message:
        "Se informado indEscala ou CNPJFab, então CEST precisa ser ser informado",
    },
  )
  .describe("prod:I01");

/**
 * @description Grupo I. Produtos e Serviços da NF-e
 */
type NfeProd = z.infer<typeof schemaNfeProd>;

export { schemaNfeProd, type NfeProd };
