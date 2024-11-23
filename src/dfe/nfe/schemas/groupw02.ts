import { z } from "zod";
import { zCustom } from "@/utils/zCustom";

const schemaNfeRetTrib = z
  .object({
    vRetPIS: zCustom.string.decimal().length(16).optional().describe("W31"),
    vRetCOFINS: zCustom.string.decimal().length(16).optional().describe("W32"),
    vRetCSLL: zCustom.string.decimal().length(16).optional().describe("W33"),
    vBCIRRF: zCustom.string.decimal().length(16).optional().describe("W34"),
    vIRRF: zCustom.string.decimal().length(16).optional().describe("W35"),
    vBCRetPrev: zCustom.string.decimal().length(16).optional().describe("W36"),
    vRetPrev: zCustom.string.decimal().length(16).optional().describe("W37"),
  })
  .describe("retTrib:W30");

/**
 * @description Grupo W02. Total da NF-e / Retenção de Tributos
 */
type NfeRetTrib = z.infer<typeof schemaNfeRetTrib>;

export { schemaNfeRetTrib, type NfeRetTrib };
