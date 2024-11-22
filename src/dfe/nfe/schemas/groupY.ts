import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

const schemaNfeCobr = z
  .object({
    fat: z
      .object({
        nFat: zCustom.string.range(1, 60).optional().describe("Y03"),
        vOrig: zCustom.string.decimal().length(16).optional().describe("Y04"),
        vDesc: zCustom.string.decimal().length(16).optional().describe("Y05"),
        vLiq: zCustom.string.decimal().length(16).optional().describe("Y06"),
      })
      .optional()
      .describe("Y02"),
    dup: z
      .array(
        z.object({
          nDup: zCustom.string.range(1, 60).optional().describe("Y08"),
          dVenc: z.string().date().optional().describe("Y09"),
          vDup: zCustom.string.numeric().describe("Y10"),
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
