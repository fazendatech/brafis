import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

const schemaExportInd = z
  .object({
    nRE: z.string().length(12).describe("I53"),
    chNFe: z.string().length(44).describe("I54"),
    qExport: zCustom.string.decimal(4, 4).max(11).describe("I55"),
  })
  .describe("exportInd:I52");

const schemaNfeDetExport = z
  .object({
    nDraw: zCustom.string
      .numeric()
      .min(9)
      .max(11)
      .refine((value) => value.length !== 10) // O número do Ato Concessório de Suspensão deve ser preenchido com 11 dígitos (AAAANNNNNND) e o número do Ato Concessório de Drawback Isenção deve ser preenchido com 9 dígitos (AANNNNNND).
      .optional()
      .describe("I51"),
    exportInd: schemaExportInd.optional().describe("I52"),
  })
  .describe("detExport:I50");

type NfeDetExport = z.infer<typeof schemaNfeDetExport>;

/**
 * @description Grupo I03. Grupo de Exportação
 */
export { schemaNfeDetExport, type NfeDetExport };
