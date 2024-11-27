import { z } from "zod";
import { zCustom } from "@/utils/zCustom";

const schemaNfeInfRespTec = z
  .object({
    CNPJ: zCustom.cnpj().describe("ZD02"),
    xContato: zCustom.length(2, 60).describe("ZD04"),
    email: zCustom.length(6, 60).email().describe("ZD05"),
    fone: zCustom.numeric().min(6).max(14).describe("ZD06"),
    idCSRT: zCustom.numeric().length(2).optional().describe("ZD08"),
    hashCSRT: z.string().length(28).optional().describe("ZD09"),
  })
  .refine(
    ({ idCSRT, hashCSRT }) => zCustom.hasAllOrNothing([idCSRT, hashCSRT]),
    {
      message: "Os campos idCSRT e hashCSRT devem ser informados juntos.",
    },
  )
  .describe("infRespTec:ZD01");

/**
 * @description Grupo ZD. Informações do Responsável Técnico
 */
type NfeInfRespTec = z.infer<typeof schemaNfeInfRespTec>;

export { schemaNfeInfRespTec, type NfeInfRespTec };
