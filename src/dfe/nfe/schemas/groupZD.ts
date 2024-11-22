import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

const schemaNfeInfRespTec = z
  .object({
    CNPJ: zCustom.string.cnpj().describe("ZD02"),
    xContato: zCustom.string.range(2, 60).describe("ZD04"),
    email: zCustom.string.range(6, 60).email().describe("ZD05"),
    fone: zCustom.string.numeric().min(6).max(14).describe("ZD06"),
    idCSRT: zCustom.string.numeric().length(2).optional().describe("ZD08"),
    hashCSRT: z.string().length(28).optional().describe("ZD09"),
  })
  .refine(({ idCSRT, hashCSRT }) => !idCSRT === !hashCSRT, {
    message: "Se informado, idCSRT e hashCSRT devem ser informados juntos.",
  })
  .describe("infRespTec:ZD01");

type NfeInfRespTec = z.infer<typeof schemaNfeInfRespTec>;

/**
 * @description Grupo ZD. Informações do Responsável Técnico
 */
export { schemaNfeInfRespTec, type NfeInfRespTec };
