import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

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
 * @returns zCustom.string.decimal(2, 4).max(8).describe("N14");
 */
const zPRedBC = () => zCustom.string.decimal(2, 4).max(8).describe("N14");
/**
 * @returns zCustom.string.decimal().max(16).describe("N15");
 */
const zVBC = () => zCustom.string.decimal().max(16).describe("N15");
/**
 * @returns zCustom.string.decimal(2, 4).max(8).describe("N16");
 */
const zPICMS = () => zCustom.string.decimal(2, 4).max(8).describe("N16");
/**
 * @returns zCustom.string.decimal().max(16).describe("N17");
 */
const zVICMS = () => zCustom.string.decimal().max(16).describe("N17");
/**
 * @returns zCustom.string.decimal().max(16).describe("N17.a");
 */
const zVBCFCP = () =>
  zCustom.string.decimal().max(16).optional().describe("N17.a");
/**
 * @returns zCustom.string.decimal(2, 4).max(8).optional().describe("N17.b");
 */
const zPFCP = () =>
  zCustom.string.decimal(2, 4).max(8).optional().describe("N17.b");
/**
 * @returns zCustom.string.decimal().max(16).describe("N17.c");
 */
const zVFCP = () =>
  zCustom.string.decimal().max(16).optional().describe("N17.c");
/**
 * @returns z.enum(["0", "1", "2", "3", "4", "5", "6"]).describe("N18");
 */
const zModBCST = () =>
  z.enum(["0", "1", "2", "3", "4", "5", "6"]).describe("N18");
/**
 * @returns zCustom.string.decimal(2, 4).max(8).describe("N19");
 */
const zPMVAST = () =>
  zCustom.string.decimal(2, 4).max(8).optional().describe("N19");
/**
 * @returns zCustom.string.decimal(2, 4).max(8).describe("N20");
 */
const zPRedBCST = () =>
  zCustom.string.decimal(2, 4).max(8).optional().describe("N20");
/**
 * @returns zCustom.string.decimal().max(16).describe("N21");
 */
const zVBCST = () => zCustom.string.decimal().max(16).describe("N21");
/**
 * @returns zCustom.string.decimal(2, 4).max(8).describe("N22");
 */
const zPICMSST = () => zCustom.string.decimal(2, 4).max(8).describe("N22");
/**
 * @returns zCustom.string.decimal().max(16).describe("N23");
 */
const zVICMSST = () => zCustom.string.decimal().max(16).describe("N23");
/**
 * @returns zCustom.string.decimal().max(16).optional().describe("N23a");
 */
const zVBCFCPST = () =>
  zCustom.string.decimal().max(16).optional().describe("N23a");
/**
 * @returns zCustom.string.decimal(2, 4).max(8).optional().describe("N23b");
 */
const zPFCPST = () =>
  zCustom.string.decimal(2, 4).max(8).optional().describe("N23b");
/**
 * @returns zCustom.string.decimal().max(16).optional().describe("N23c");
 */
const zVFCPST = () =>
  zCustom.string.decimal().max(16).optional().describe("N23d");
/**
 * @returns zCustom.string.decimal().max(16).optional().describe("N28a");
 */
const zVICMSDeson = () =>
  zCustom.string.decimal().max(16).optional().describe("N28a");
/**
 * @returns z.enum(array).optional().describe("N28");
 */
const zMotDesICMS = (array: [string, ...string[]]) =>
  z.enum(array).optional().describe("N28");

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
  .refine(
    ({ vBCFCP, pFCP, vFCP }) => {
      if (vBCFCP && (!pFCP || !vFCP)) {
        return false;
      }
      if (pFCP && (!vBCFCP || !vFCP)) {
        return false;
      }
      if (vFCP && (!vBCFCP || !pFCP)) {
        return false;
      }
      return true;
    },
    {
      message:
        "No caso de percentual relativo ao Fundo de Combate à Pobreza (FCP), então vBCFCP, vFCP e pFCP devem ser todos informados",
    },
  )
  .refine(
    ({ vBCFCPST, pFCPST, vFCPST }) => {
      if (vBCFCPST && (!pFCPST || !vFCPST)) {
        return false;
      }
      if (pFCPST && (!vBCFCPST || !vFCPST)) {
        return false;
      }
      if (vFCPST && (!vBCFCPST || !pFCPST)) {
        return false;
      }
      return true;
    },
    {
      message:
        "No caso de percentual relativo ao Fundo de Combate à Pobreza (FCP) retido por Substituição Tributária, então vBCFCP, vFCP e pFCP devem ser todos informados",
    },
  )
  .describe("ICMS10:N03");

const schemaICMS20 = z
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
  .refine(
    ({ vBCFCP, pFCP, vFCP }) => {
      if (vBCFCP && (!pFCP || !vFCP)) {
        return false;
      }
      if (pFCP && (!vBCFCP || !vFCP)) {
        return false;
      }
      if (vFCP && (!vBCFCP || !pFCP)) {
        return false;
      }
      return true;
    },
    {
      message:
        "No caso de percentual relativo ao Fundo de Combate à Pobreza (FCP), então vBCFCP, vFCP e pFCP devem ser todos informados",
    },
  )
  .refine(
    ({ vICMSDeson, motDesICMS }) => {
      if (vICMSDeson && !motDesICMS) {
        return false;
      }
      if (!vICMSDeson && motDesICMS) {
        return false;
      }
      return true;
    },
    {
      message:
        "No caso de ICMS Desoneração, então vICMSDeson e motDesICMS devem ser ambos informados",
    },
  )
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
  .describe("ICMS30:N05");

const schemaNfeICMS = z
  .object({ ICMS: schemaNfeICMS00.or(schemaNfeICMS10).or(schemaICMS20) })
  .describe("N01");

/**
 * @description Grupo N01. ICMS Normal e ST
 */
type NfeICMS = z.infer<typeof schemaNfeICMS>;

export { schemaNfeICMS, type NfeICMS };
