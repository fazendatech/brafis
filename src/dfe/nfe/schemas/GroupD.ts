import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

import { zUf } from "./GroupC";

const schemaNfeAvulsa = z
  .object({
    CNPJ: zCustom.string.cnpj().describe("D02"),
    xOrgao: zCustom.string.range(1, 60).describe("D03"),
    matr: zCustom.string.range(1, 60).describe("D04"),
    xAgente: zCustom.string.range(1, 60).describe("D05"),
    fone: zCustom.string.range(6, 14).optional().describe("D06"),
    UF: zUf().describe("D07"),
    nDAR: zCustom.string.range(1, 60).optional().describe("D08"),
    dEmi: z.string().date().optional().describe("D09"),
    vDAR: zCustom.string.decimal().min(1).max(13).optional().describe("D10"),
    repEmi: zCustom.string.range(1, 60).describe("D11"),
    dPag: z.string().date().optional().describe("D12"),
  })
  .describe("avulsa:D01");

type NfeAvulsa = z.infer<typeof schemaNfeAvulsa>;

/**
 * @description Grupo D. Identificação do Fisco Emitente da NF-e (uso exclusivo do fisco)
 */
export { schemaNfeAvulsa, type NfeAvulsa };
