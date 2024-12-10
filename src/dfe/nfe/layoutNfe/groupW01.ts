import { z } from "zod";
import { zCustom } from "@/utils/zCustom";

const schemaNfeIssqnTot = z
  .object({
    vServ: zCustom.decimal(13, 2).optional().describe("W18"),
    vBC: zCustom.decimal(13, 2).optional().describe("W19"),
    vISS: zCustom.decimal(13, 2).optional().describe("W20"),
    vPIS: zCustom.decimal(13, 2).optional().describe("W21"),
    vCOFINS: zCustom.decimal(13, 2).optional().describe("W22"),
    dCompet: z.string().date().describe("W22a"),
    vDeducao: zCustom.decimal(13, 2).optional().describe("W22b"),
    vOutro: zCustom.decimal(13, 2).optional().describe("W22c"),
    vDescIncond: zCustom.decimal(13, 2).optional().describe("W22d"),
    vDescCond: zCustom.decimal(13, 2).optional().describe("W22e"),
    vISSRet: zCustom.decimal(13, 2).optional().describe("W22f"),
    cRegTrib: z
      .enum(["1", "2", "3", "4", "5", "6"])
      .optional()
      .describe("W22g"),
  })
  .describe("ISSQNtot:W17");

/**
 * @description Grupo W01. Total da NF-e / ISSQN
 */
type NfeIssqnTot = z.infer<typeof schemaNfeIssqnTot>;

export { schemaNfeIssqnTot, type NfeIssqnTot };
