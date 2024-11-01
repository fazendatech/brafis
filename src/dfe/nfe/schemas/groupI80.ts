import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

const schemaNfeRastro = z
  .object({
    nLote: zCustom.string.range(1, 20).describe("I81"),
    qLote: zCustom.string.decimal(3, 3).max(8).describe("I82"),
    dFab: zCustom.string.date().describe("I83"),
    dVal: zCustom.string.date().describe("I84"),
    cAgreg: zCustom.string.range(1, 20).optional().describe("I85"),
  })
  .describe("rastro:I80");

type NfeRastro = z.infer<typeof schemaNfeRastro>;

/**
 * @description Grupo I80. Rastreabilidade de Produto
 */
export { schemaNfeRastro, type NfeRastro };
