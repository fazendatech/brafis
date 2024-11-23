import { z } from "zod";
import { zCustom } from "@/utils/zCustom";

const schemaNfeDetExport = z
  .object({
    nDraw: zCustom.string
      .numeric()
      .refine((value) => value.length === 9 || value.length === 11, {
        message:
          "O número do Ato Concessório de Suspensão deve ser preenchido com 11 dígitos (AAAANNNNNND) e o número do Ato Concessório de Drawback Isenção deve ser preenchido com 9 dígitos (AANNNNNND).",
      })
      .optional()
      .describe("I51"),
    exportInd: z
      .object({
        nRE: z.string().length(12).describe("I53"),
        chNFe: z.string().length(44).describe("I54"),
        qExport: zCustom.string.decimal(4, 4).max(11).describe("I55"),
      })
      .optional()
      .describe("I52"),
  })
  .describe("detExport:I50");

/**
 * @description Grupo I03. Grupo de Exportação
 */
type NfeDetExport = z.infer<typeof schemaNfeDetExport>;

export { schemaNfeDetExport, type NfeDetExport };
