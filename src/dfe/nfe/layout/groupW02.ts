import { zCustom } from "@/utils/zCustom";
import { z } from "zod";

const schemaNfeRetTrib = z
  .object({
    vRetPIS: zCustom.decimal(13, 2).optional().describe("W31"),
    vRetCOFINS: zCustom.decimal(13, 2).optional().describe("W32"),
    vRetCSLL: zCustom.decimal(13, 2).optional().describe("W33"),
    vBCIRRF: zCustom.decimal(13, 2).optional().describe("W34"),
    vIRRF: zCustom.decimal(13, 2).optional().describe("W35"),
    vBCRetPrev: zCustom.decimal(13, 2).optional().describe("W36"),
    vRetPrev: zCustom.decimal(13, 2).optional().describe("W37"),
  })
  .describe("retTrib:W30");

/**
 * @description Grupo W02. Total da NF-e / Retenção de Tributos
 */
type NfeRetTrib = z.infer<typeof schemaNfeRetTrib>;

export { schemaNfeRetTrib, type NfeRetTrib };
