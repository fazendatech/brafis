import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUf } from ".";

const schemaNfeDi = z
  .object({
    nDI: zCustom.string.range(1, 12).describe("I19"),
    dDI: zCustom.string.date().describe("I20"),
    xLocDesemb: zCustom.string.range(1, 60).describe("I21"),
    UFDesemb: zUf().describe("I22"),
    dDesemb: zCustom.string.date().describe("I23"),
    tpViaTransp: z.enum(["1", "2", "3", "4", "5", "6", "7"]).describe("I23a"),
    vAFRMM: zCustom.string.decimal(13, 2).optional().describe("I23b"),
    tpIntermedio: z.enum(["1", "2", "3"]).describe("I23c"),
    CNPJ: zCustom.string.cnpj().optional().describe("I23d"),
    UFTerceiro: zUf().optional().describe("I23e"),
    cExportador: zCustom.string.range(1, 60).describe("I24"),
    adi: z
      .array(
        z.object({
          nAdicao: zCustom.string.numeric().min(1).max(3).describe("I26"),
          nSeqAdic: zCustom.string.numeric().min(1).max(3).describe("I27"),
          cFabricante: zCustom.string.range(1, 60).describe("I28"),
          vDescDI: zCustom.string.decimal(13, 2).optional().describe("I29"),
          nDraw: zCustom.string
            .numeric()
            .refine((value) => value.length === 9 || value.length === 11, {
              message:
                "O número do Ato Concessório de Suspensão deve ser preenchido com 11 dígitos (AAAANNNNNND) e o número do Ato Concessório de Drawback Isenção deve ser preenchido com 9 dígitos (AANNNNNND).",
            })
            .optional()
            .describe("I29a"),
        }),
      )
      .min(1)
      .max(100)
      .describe("I25"),
  })
  .describe("DI:I18");

/**
 * @description Grupo I01. Declaração de Importação
 */
type NfeDi = z.infer<typeof schemaNfeDi>;

export { schemaNfeDi, type NfeDi };
