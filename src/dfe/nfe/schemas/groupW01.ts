import { z } from "zod";
import { zCustom } from "@/utils/zCustom";

const schemaNfeISSQNTot = z
  .object({
    vServ: zCustom.string.decimal().length(16).optional().describe("W18"),
    vBC: zCustom.string.decimal().length(16).optional().describe("W19"),
    vISS: zCustom.string.decimal().length(16).optional().describe("W20"),
    vPIS: zCustom.string.decimal().length(16).optional().describe("W21"),
    vCOFINS: zCustom.string.decimal().length(16).optional().describe("W22"),
    dCompet: z.string().date().describe("W22a"),
    vDeducao: zCustom.string.decimal().length(16).optional().describe("W22b"),
    vOutro: zCustom.string.decimal().length(16).optional().describe("W22c"),
    vDescIncond: zCustom.string
      .decimal()
      .length(16)
      .optional()
      .describe("W22d"),
    vDescCond: zCustom.string.decimal().length(16).optional().describe("W22e"),
    vISSRet: zCustom.string.decimal().length(16).optional().describe("W22f"),
    cRegTrib: z
      .enum(["1", "2", "3", "4", "5", "6"])
      .optional()
      .describe("W22g"),
  })
  .describe("ISSQNtot:W17");

/**
 * @description Grupo W01. Total da NF-e / ISSQN
 */
type NfeISSQNTot = z.infer<typeof schemaNfeISSQNTot>;

export { schemaNfeISSQNTot, type NfeISSQNTot };
