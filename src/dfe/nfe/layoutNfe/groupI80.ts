import { z } from "zod";
import { zCustom } from "@/utils/zCustom";

const schemaNfeRastro = z
  .object({
    nLote: zCustom.length(1, 20).describe("I81"),
    qLote: zCustom.decimal(8, 3).describe("I82"),
    dFab: z.string().date().describe("I83"),
    dVal: z.string().date().describe("I84"),
    cAgreg: zCustom.length(1, 20).optional().describe("I85"),
  })
  .describe("rastro:I80");

/**
 * @description Grupo I80. Rastreabilidade de Produto
 */
type NfeRastro = z.infer<typeof schemaNfeRastro>;

export { schemaNfeRastro, type NfeRastro };
