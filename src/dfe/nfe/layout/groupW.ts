import { zCustom } from "@/utils/zCustom";
import { z } from "zod";
import { schemaNfeIssqnTot } from "./groupW01";
import { schemaNfeRetTrib } from "./groupW02";

const schemaNfeTotal = z
  .object({
    ICMSTot: z
      .object({
        vBC: zCustom.decimal(13, 2).describe("W03"),
        vICMS: zCustom.decimal(13, 2).describe("W04"),
        vICMSDeson: zCustom.decimal(13, 2).describe("W04a"),
        vFCPUFDest: zCustom.decimal(13, 2).optional().describe("W04c"),
        bICMSUFDest: zCustom.decimal(13, 2).optional().describe("W04e"),
        vICMSUFRemet: zCustom.decimal(13, 2).optional().describe("W04g"),
        vFCP: zCustom.decimal(13, 2).describe("W04h"),
        vBCST: zCustom.decimal(13, 2).describe("W05"),
        vST: zCustom.decimal(13, 2).describe("W06"),
        vFCPST: zCustom.decimal(13, 2).describe("W06a"),
        vFCPSTRet: zCustom.decimal(13, 2).describe("W06b"),
        vProd: zCustom.decimal(13, 2).describe("W07"),
        vFrete: zCustom.decimal(13, 2).describe("W08"),
        vSeg: zCustom.decimal(13, 2).describe("W09"),
        vDesc: zCustom.decimal(13, 2).describe("W10"),
        vII: zCustom.decimal(13, 2).describe("W11"),
        vIPI: zCustom.decimal(13, 2).describe("W12"),
        vIPIDevol: zCustom.decimal(13, 2).describe("W12a"),
        vPIS: zCustom.decimal(13, 2).describe("W13"),
        vCOFINS: zCustom.decimal(13, 2).describe("W14"),
        vOutro: zCustom.decimal(13, 2).describe("W15"),
        vNF: zCustom.decimal(13, 2).describe("W16"),
        vTotTrib: zCustom.decimal(13, 2).optional().describe("W16a"),
        ISSQNtot: schemaNfeIssqnTot.optional(),
        retTrib: schemaNfeRetTrib.optional(),
      })
      .describe("ICMSTot:W02"),
    ISSQNtot: schemaNfeIssqnTot.optional().describe("W17"),
    retTrib: schemaNfeRetTrib.optional().describe("W23"),
  })
  .describe("total:W01");

/**
 * @description Grupo W. Total da NF-e
 */
type NfeTotal = z.infer<typeof schemaNfeTotal>;

export { schemaNfeTotal, type NfeTotal };
