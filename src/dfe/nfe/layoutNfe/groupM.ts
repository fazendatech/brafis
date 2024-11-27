import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { schemaNfeICMS } from "./groupN01";

const schemaNfeImposto = z
  .object({
    vTotTrib: zCustom.string.decimal(13, 2).optional().describe("M02"),
    ICMS: schemaNfeICMS,
  })
  .describe("imposto:M01");

/**
 * @description Grupo M. Tributos incidentes no Produto ou Serviço
 */
type NfeImposto = z.infer<typeof schemaNfeImposto>;

export { schemaNfeImposto, type NfeImposto };
