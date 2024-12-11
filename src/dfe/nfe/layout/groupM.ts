import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { schemaNfeIcms } from "./groupN01";

const schemaNfeImposto = z
  .object({
    vTotTrib: zCustom.decimal(13, 2).optional().describe("M02"),
    ICMS: schemaNfeIcms,
    IPI: z.object({}).optional(),
    II: z.object({}).optional(),
    PIS: z.object({}).optional(),
    PISST: z.object({}).optional(),
    COFINS: z.object({}).optional(),
    COFINSST: z.object({}).optional(),
    ISSQN: z.object({}).optional(),
    ICMSUFDest: z.object({}).optional(),
  })
  .describe("imposto:M01");

/**
 * @description Grupo M. Tributos incidentes no Produto ou Serviço
 */
type NfeImposto = z.infer<typeof schemaNfeImposto>;

export { schemaNfeImposto, type NfeImposto };
