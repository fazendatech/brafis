import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { schemaNfeISSQNTot } from "./groupW01";
import { schemaNfeRetTrib } from "./groupw02";

const schemaNfeTotal = z
  .object({
    ICMSTot: z
      .object({
        vBC: zCustom.string.decimal().length(16).describe("W03"),
        vICMS: zCustom.string.decimal().length(16).describe("W04"),
        vICMSDeson: zCustom.string.decimal().length(16).describe("W04a"),
        vFCPUFDest: zCustom.string
          .decimal()
          .length(16)
          .optional()
          .describe("W04c"),
        bICMSUFDest: zCustom.string
          .decimal()
          .length(16)
          .optional()
          .describe("W04e"),
        vICMSUFRemet: zCustom.string
          .decimal()
          .length(16)
          .optional()
          .describe("W04g"),
        vFCP: zCustom.string.decimal().length(16).describe("W04h"),
        vBCST: zCustom.string.decimal().length(16).describe("W05"),
        vST: zCustom.string.decimal().length(16).describe("W06"),
        vFCPST: zCustom.string.decimal().length(16).describe("W06a"),
        vFCPSTRet: zCustom.string.decimal().length(16).describe("W06b"),
        vProd: zCustom.string.decimal().length(16).describe("W07"),
        vFrete: zCustom.string.decimal().length(16).describe("W08"),
        vSeg: zCustom.string.decimal().length(16).describe("W09"),
        vDesc: zCustom.string.decimal().length(16).describe("W10"),
        vII: zCustom.string.decimal().length(16).describe("W11"),
        vIPI: zCustom.string.decimal().length(16).describe("W12"),
        vIPIDevol: zCustom.string.decimal().length(16).describe("W12a"),
        vPIS: zCustom.string.decimal().length(16).describe("W13"),
        vCOFINS: zCustom.string.decimal().length(16).describe("W14"),
        vOutro: zCustom.string.decimal().length(16).describe("W15"),
        vNF: zCustom.string.decimal().length(16).describe("W16"),
        vTotTrib: zCustom.string
          .decimal()
          .length(16)
          .optional()
          .describe("W16a"),
        ISSQNtot: schemaNfeISSQNTot.optional(),
        retTrib: schemaNfeRetTrib.optional(),
      })
      .describe("ICMSTot:W02"),
  })
  .describe("total:W01");

/**
 * @description Grupo W. Total da NF-e
 */
type NfeTotal = z.infer<typeof schemaNfeTotal>;

export { schemaNfeTotal, type NfeTotal };
