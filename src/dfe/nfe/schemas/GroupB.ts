import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

import { schemaNfeNfRef } from "./GroupBA";

export const zUfCode = () =>
  z.enum([
    "12",
    "27",
    "16",
    "13",
    "29",
    "23",
    "53",
    "32",
    "52",
    "21",
    "51",
    "50",
    "31",
    "15",
    "25",
    "41",
    "26",
    "22",
    "33",
    "24",
    "43",
    "11",
    "14",
    "42",
    "35",
    "28",
    "17",
  ]);

const schemaNfeIde = z
  .object({
    cUF: zUfCode().describe("B02"),
    cNF: zCustom.string.numeric().length(8).describe("B03"), // TODO: Validar
    natOp: zCustom.string.range(1, 60).describe("B04"), // TODO: Validar
    mod: z.enum(["55", "65"]).describe("B06"),
    serie: zCustom.string.numeric().length(3).describe("B07"),
    nNF: zCustom.string.numeric().min(1).max(9).describe("B08"),
    dhEmi: zCustom.string.date().describe("B09"),
    dhSaiEnt: zCustom.string.date().describe("B10"),
    tpNF: z.enum(["0", "1"]).describe("B11"),
    idDest: z.enum(["1", "2", "3"]).describe("B11a"),
    cMunFG: zCustom.string.numeric().length(7).describe("B12"),
    tpImp: z.enum(["0", "1", "2", "3", "4", "5"]).describe("B21"),
    tpEmis: z.enum(["1", "2", "3", "4", "5", "6", "7", "9"]).describe("B22"),
    cDV: z.number().nonnegative().lt(10).describe("B23"), // TODO: TENTAR ADICIONAR O ALGORITMO PARA PREENCHER AUTOMÁTICO
    tpAmb: z.enum(["1", "2"]).describe("B24"),
    finNFe: z.enum(["1", "2", "3", "4"]).describe("B25"),
    indFinal: z.enum(["0", "1"]).describe("B25a"),
    indPres: z.enum(["0", "1", "2", "3", "4", "5", "9"]).describe("B25b"),
    indIntermed: z.enum(["0", "1"]).optional().describe("B25c"),
    procEmi: z.enum(["0", "1", "2", "3"]).describe("B26"),
    verProc: zCustom.string.range(1, 20).describe("B27"),
    dhCont: zCustom.string.date().optional().describe("B28"),
    xJust: zCustom.string.range(15, 256).optional().describe("B29"),
    NFref: z.array(schemaNfeNfRef).max(500).optional(),
  })
  .describe("ide:B01");

type NfeIde = z.infer<typeof schemaNfeIde>;

/**
 * @description Grupo B. Identificação da Nota Fiscal eletrônica
 */
export { schemaNfeIde, type NfeIde };
