import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

const schemaNfeImposto = z
  .object({
    vTotTrib: zCustom.string.decimal().max(16).optional().describe("M02"),
  })
  .describe("imposto:M01");

/**
 * @description Grupo M. Tributos incidentes no Produto ou Serviço
 */
type NfeImposto = z.infer<typeof schemaNfeImposto>;

export { schemaNfeImposto, type NfeImposto };
