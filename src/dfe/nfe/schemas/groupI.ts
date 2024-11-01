import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

import { schemaNfeDi } from "./groupI01";
import { schemaNfeDetExport } from "./groupI03";
import { schemaNfeRastro } from "./groupI80";

const schemaNfeProd = z
  .object({
    cProd: zCustom.string.range(1, 60).describe("I02"),
    cEAN: zCustom.string.range(8, 14).describe("I03"),
    xProd: zCustom.string.range(1, 120).describe("I04"),
    NCM: zCustom.string.numeric().length(8).or(z.literal("00")).describe("I05"), // Obrigatória informação do NCM completo (8 dígitos). Nota: Em caso de item de serviço ou item que não tenham produto (ex. transferência de crédito, crédito do ativo imobilizado, etc.), informar o valor 00
    NVE: z.array(z.string().length(6)).max(8).optional().describe("I05a"),
    // I05b
    CEST: zCustom.string.numeric().length(7).optional().describe("I05c"),
    indEscala: z.enum(["S", "N"]).optional().describe("I05d"),
    CNPJFab: zCustom.string.cnpj().optional().describe("I05e"),
    // END I05b
    cBenef: z
      .string()
      .min(8)
      .max(10)
      .refine((value) => value.length !== 9)
      .optional()
      .describe("I05f"),
    EXTIPI: zCustom.string.numeric().min(2).max(3).optional().describe("I06"),
    CFOP: zCustom.string.numeric().length(4).describe("I08"),
    uCom: zCustom.string.range(1, 6).describe("I09"),
    qCom: zCustom.string.decimal(1, 4).max(11).describe("I10"),
    vUnCom: zCustom.string.decimal(1, 10).max(11).describe("I10a"),
    vProd: zCustom.string.decimal().max(13).describe("I11"),
    cEANTrib: zCustom.string.range(8, 14).optional().describe("I12"),
    uTrib: zCustom.string.range(1, 6).describe("I13"),
    qTrib: zCustom.string.decimal(1, 4).max(11).describe("I14"),
    vUnTrib: zCustom.string.decimal(1, 10).max(11).describe("I14a"),
    vFrete: zCustom.string
      .decimal()
      .max(13)
      .or(z.literal("SEM GTIN"))
      .optional()
      .describe("I15"),
    vSeg: zCustom.string.decimal().max(13).optional().describe("I16"),
    vDesc: zCustom.string.decimal().max(13).optional().describe("I17"),
    vOutro: zCustom.string.decimal().max(13).optional().describe("I17a"),
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
  .refine((obj) => (obj.indEscala || obj.CNPJFab ? obj.CEST : true)) // Grupo Opcional (I05b)
  .describe("prod:I01");

type NfeProd = z.infer<typeof schemaNfeProd>;

/**
 * @description Grupo I. Produtos e Serviços da NF-e
 */
export { schemaNfeProd, type NfeProd };
