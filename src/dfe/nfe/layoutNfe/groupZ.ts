import { z } from "zod";
import { zCustom } from "@/utils/zCustom";

const schemaNfeInfAdic = z
  .object({
    infAdFisco: zCustom.length(1, 2000).optional().describe("Z02"),
    infCpl: zCustom.length(1, 5000).optional().describe("Z03"),
    obsCont: z
      .array(
        z.object({
          xCampo: zCustom.length(1, 20).describe("Z05"),
          xTexto: zCustom.length(1, 160).describe("Z06"),
        }),
      )
      .max(10)
      .optional()
      .describe("Z04"),
    obsFisco: z
      .array(
        z.object({
          xCampo: zCustom.length(1, 20).describe("Z08"),
          xTexto: zCustom.length(1, 160).describe("Z09"),
        }),
      )
      .max(10)
      .optional()
      .describe("Z07"),
    procRef: z
      .array(
        z.object({
          nProc: zCustom.length(1, 60).describe("Z11"),
          indProc: z.enum(["0", "1", "2", "3", "9"]).describe("Z12"),
        }),
      )
      .max(100)
      .optional()
      .describe("Z10"),
  })
  .describe("infAdic:Z01");

/**
 * @description Grupo Z. Informações Adicionais da NF-e
 */
type NfeInfAdic = z.infer<typeof schemaNfeInfAdic>;

export { schemaNfeInfAdic, type NfeInfAdic };
