import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUf } from "./misc";

const schemaNfeAvulsa = z
  .object({
    CNPJ: zCustom.cnpj().describe("D02"),
    xOrgao: zCustom.length(1, 60).describe("D03"),
    matr: zCustom.length(1, 60).describe("D04"),
    xAgente: zCustom.length(1, 60).describe("D05"),
    fone: zCustom.phone().optional().describe("D06"),
    UF: zUf().describe("D07"),
    nDAR: zCustom.length(1, 60).optional().describe("D08"),
    dEmi: z.string().date().optional().describe("D09"),
    vDAR: zCustom.decimal(13, 2).optional().describe("D10"),
    repEmi: zCustom.length(1, 60).describe("D11"),
    dPag: z.string().date().optional().describe("D12"),
  })
  .describe("avulsa:D01");

/**
 * @description Grupo D. Identificação do Fisco Emitente da NF-e (uso exclusivo do fisco)
 */
type NfeAvulsa = z.infer<typeof schemaNfeAvulsa>;

export { schemaNfeAvulsa, type NfeAvulsa };
