import { z } from "zod";
import { zCustom } from "@/utils/zCustom";

const schemaNfeCobr = z
  .object({
    fat: z
      .object({
        nFat: zCustom.range(1, 60).optional().describe("Y03"),
        vOrig: zCustom.decimal(13, 2).optional().describe("Y04"),
        vDesc: zCustom.decimal(13, 2).optional().describe("Y05"),
        vLiq: zCustom.decimal(13, 2).optional().describe("Y06"),
      })
      .optional()
      .describe("Y02"),
    dup: z
      .array(
        z.object({
          nDup: zCustom.range(1, 60).optional().describe("Y08"),
          dVenc: z.string().date().optional().describe("Y09"),
          vDup: zCustom.decimal(13, 2).describe("Y10"),
        }),
      )
      .max(120)
      .optional()
      .describe("Y07"),
  })
  .describe("cobr:Y01");

/**
 * @description Grupo Y. Dados da Cobrança
 */
type NfeCobr = z.infer<typeof schemaNfeCobr>;

export { schemaNfeCobr, type NfeCobr };
