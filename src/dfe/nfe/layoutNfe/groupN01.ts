import { z } from "zod";

import { zCustom } from "@/utils/zCustom";
import { hasJSDocParameterTags } from "typescript";

/**
 * @returns z.enum(["0", "1", "2", "3", "4", "5", "6", "7", "8"]).describe("N11");
 */
const zOrig = () =>
  z.enum(["0", "1", "2", "3", "4", "5", "6", "7", "8"]).describe("N11");
/**
 * @returns z.literal(cst).describe("N12");
 */
const zCST = (cst: string) => z.literal(cst).describe("N12");
/**
 * @returns z.enum(["0", "1", "2", "3"]).describe("N13");
 */
const zModBC = () => z.enum(["0", "1", "2", "3"]).describe("N13");
/**
 * @returns zCustom.decimal(3, 4).describe("N14");
 */
const zPRedBC = () => zCustom.decimal(3, 4).describe("N14");
/**
 * @returns zCustom.decimal(13,2).describe("N15");
 */
const zVBC = () => zCustom.decimal(13, 2).describe("N15");
/**
 * @returns zCustom.decimal(3, 4).describe("N16");
 */
const zPICMS = () => zCustom.decimal(3, 4).describe("N16");
/**
 * @returns zCustom.decimal(13, 2).describe("N17");
 */
const zVICMS = () => zCustom.decimal(13, 2).describe("N17");
/**
 * @returns zCustom.decimal(13, 2).describe("N17.a");
 */
const zVBCFCP = () => zCustom.decimal(13, 2).optional().describe("N17.a");
/**
 * @returns zCustom.decimal(3, 4).optional().describe("N17.b");
 */
const zPFCP = () => zCustom.decimal(3, 4).optional().describe("N17.b");
/**
 * @returns zCustom.decimal(13, 2).describe("N17.c");
 */
const zVFCP = () => zCustom.decimal(13, 2).optional().describe("N17.c");
/**
 * @returns z.enum(["0", "1", "2", "3", "4", "5", "6"]).describe("N18");
 */
const zModBCST = () =>
  z.enum(["0", "1", "2", "3", "4", "5", "6"]).describe("N18");
/**
 * @returns zCustom.decimal(3, 4).describe("N19");
 */
const zPMVAST = () => zCustom.decimal(3, 4).optional().describe("N19");
/**
 * @returns zCustom.decimal(3, 4).describe("N20");
 */
const zPRedBCST = () => zCustom.decimal(3, 4).optional().describe("N20");
/**
 * @returns zCustom.decimal(13, 2).describe("N21");
 */
const zVBCST = () => zCustom.decimal(13, 2).describe("N21");
/**
 * @returns zCustom.decimal(3, 4).describe("N22");
 */
const zPICMSST = () => zCustom.decimal(3, 4).describe("N22");
/**
 * @returns zCustom.decimal(13, 2).describe("N23");
 */
const zVICMSST = () => zCustom.decimal(13, 2).describe("N23");
/**
 * @returns zCustom.decimal(13, 2).optional().describe("N23a");
 */
const zVBCFCPST = () => zCustom.decimal(13, 2).optional().describe("N23a");
/**
 * @returns zCustom.decimal(3, 4).optional().describe("N23b");
 */
const zPFCPST = () => zCustom.decimal(3, 4).optional().describe("N23b");
/**
 * @returns zCustom.decimal(13, 2).optional().describe("N23c");
 */
const zVFCPST = () => zCustom.decimal(13, 2).optional().describe("N23d");
/**
 * @returns zCustom.decimal(13, 2).optional().describe("N28a");
 */
const zVICMSDeson = () => zCustom.decimal(13, 2).optional().describe("N28a");
/**
 * @returns z.enum(array).optional().describe("N28");
 */
const zMotDesICMS = (array: [string, ...string[]]) =>
  z.enum(array).optional().describe("N28");

function hasFcp(vBCFCP?: string, pFCP?: string, vFCP?: string) {
  if (vBCFCP && pFCP && vFCP) {
    return true;
  }
  if (!vBCFCP && !pFCP && !vFCP) {
    return true;
  }
  return false;
}
function hasDes(vICMSDeson?: string, motDesICMS?: string) {
  if (vICMSDeson && !motDesICMS) {
    return false;
  }
  if (!vICMSDeson && motDesICMS) {
    return false;
  }
  return true;
}

const messageFcp =
  "No caso de percentual relativo ao Fundo de Combate à Pobreza (FCP), então vBCFCP, vFCP e pFCP devem ser todos informados";
const messageFcpst =
  "No caso de percentual relativo ao Fundo de Combate à Pobreza (FCP) retido por Substituição Tributária, então vBCFCPST, vFCPST e pFCPST devem ser todos informados";
const messageDes =
  "No caso de ICMS Desoneração, então vICMSDeson e motDesICMS devem ser ambos informados";

const schemaNfeICMS00 = z
  .object({
    orig: zOrig(),
    CST: zCST("00"),
    modBC: zModBC(),
    vBC: zVBC(),
    pICMS: zPICMS(),
    vICMS: zVICMS(),
    pFCP: zPFCP(),
    vFCP: zVFCP(),
  })
  .refine(
    ({ pFCP, vFCP }) => {
      if (pFCP && !vFCP) {
        return false;
      }
      if (!pFCP && vFCP) {
        return false;
      }
      return true;
    },
    {
      message:
        "No caso de percentual relativo ao Fundo de Combate à Pobreza (FCP), então vFCP e pFCP devem ser ambos informados",
    },
  )
  .describe("ICMS00:N02");

const schemaNfeICMS10 = z
  .object({
    orig: zOrig(),
    CST: zCST("10"),
    modBC: zModBC(),
    vBC: zVBC(),
    pICMS: zPICMS(),
    vICMS: zVICMS(),
    vBCFCP: zVBCFCP(),
    pFCP: zPFCP(),
    vFCP: zVFCP(),
    modBCST: zModBCST(),
    pMVAST: zPMVAST(),
    pRedBCST: zPRedBCST(),
    vBCST: zVBCST(),
    pICMSST: zPICMSST(),
    vICMSST: zVICMSST(),
    vBCFCPST: zVBCFCPST(),
    pFCPST: zPFCPST(),
    vFCPST: zVFCPST(),
  })
  .refine(({ vBCFCP, pFCP, vFCP }) => hasFcp(vBCFCP, pFCP, vFCP), {
    message: messageFcp,
  })
  .refine(({ vBCFCPST, pFCPST, vFCPST }) => hasFcp(vBCFCPST, pFCPST, vFCPST), {
    message: messageFcpst,
  })
  .describe("ICMS10:N03");

const schemaNfeICMS20 = z
  .object({
    orig: zOrig(),
    CST: zCST("20"),
    modBC: zModBC(),
    pRedBC: zPRedBC(),
    vBC: zVBC(),
    pICMS: zPICMS(),
    vICMS: zVICMS(),
    vBCFCP: zVBCFCP(),
    pFCP: zPFCP(),
    vFCP: zVFCP(),
    vICMSDeson: zVICMSDeson(),
    motDesICMS: zMotDesICMS(["3", "9", "12"]),
  })
  .refine(({ vBCFCP, pFCP, vFCP }) => hasFcp(vBCFCP, pFCP, vFCP), {
    message: messageFcp,
  })
  .refine(({ vICMSDeson, motDesICMS }) => hasDes(vICMSDeson, motDesICMS), {
    message: messageDes,
  })
  .describe("ICMS20:N04");

const schemaNfeICMS30 = z
  .object({
    orig: zOrig(),
    CST: zCST("30"),
    modBCST: zModBCST(),
    pMVAST: zPMVAST().optional(),
    pRedBCST: zPRedBCST().optional(),
    vBCST: zVBCST(),
    pICMSST: zPICMSST(),
    vICMSST: zVICMSST(),
    vBCFCPST: zVBCFCPST(),
    pFCPST: zPFCPST(),
    vFCPST: zVFCPST(),
    vICMSDeson: zVICMSDeson(),
    motDesICMS: zMotDesICMS(["6", "7", "9"]),
  })
  .refine(({ vBCFCPST, pFCPST, vFCPST }) => hasFcp(vBCFCPST, pFCPST, vFCPST), {
    message: messageFcpst,
  })
  .refine(({ vICMSDeson, motDesICMS }) => hasDes(vICMSDeson, motDesICMS), {
    message: messageDes,
  })
  .describe("ICMS30:N05");

const schemaNfeICMS40 = z
  .object({
    orig: zOrig(),
    CST: z.enum(["40", "41", "50"]).describe("N12"),
    vICMSDeson: zVICMSDeson(),
    motDesICMS: zMotDesICMS([
      "1",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "16",
      "90",
    ]),
  })
  .refine(({ vICMSDeson, motDesICMS }) => hasDes(vICMSDeson, motDesICMS), {
    message: messageDes,
  })
  .describe("ICMS40:N06");

const schemaNfeICMS51 = z
  .object({
    orig: zOrig(),
    CST: zCST("51"),
    modBC: zModBC().optional(),
    pRedBC: zPRedBC().optional(),
    vBC: zVBC().optional(),
    pICMS: zPICMS().optional(),
    vICMSOp: zCustom.decimal(13, 2).optional().describe("N16a"),
    pDif: zCustom.decimal(3, 4).optional().describe("N16b"),
    vICMSDif: zCustom.decimal(13, 2).optional().describe("N16c"),
    vICMS: zVICMS().optional(),
    vBCFCP: zVBCFCP(),
    pFCP: zPFCP(),
    vFCP: zVFCP(),
  })
  .refine(({ vBCFCP, pFCP, vFCP }) => hasFcp(vBCFCP, pFCP, vFCP), {
    message: messageFcp,
  })
  .describe("ICMS51:N07");

const schemaNfeICMS = z
  .object({
    ICMS: schemaNfeICMS00
      .or(schemaNfeICMS10)
      .or(schemaNfeICMS20)
      .or(schemaNfeICMS30)
      .or(schemaNfeICMS40)
      .or(schemaNfeICMS51),
  })
  .describe("ICMS:N01");

/**
 * @description Grupo N01. ICMS Normal e ST
 */
type NfeICMS = z.infer<typeof schemaNfeICMS>;

export { schemaNfeICMS, type NfeICMS };
