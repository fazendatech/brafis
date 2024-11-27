import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { invalidCnfs, zUfCode } from ".";
import { schemaNfeNfRef } from "./groupBA";

const schemaNfeIde = z
  .object({
    cUF: zUfCode().describe("B02"),
    cNF: zCustom.string
      .numeric()
      .length(8)
      .refine((cNF) => !invalidCnfs.has(cNF), {
        message: "Código numérico em formato inválido.",
      })
      .describe("B03"),
    natOp: zCustom.string.range(1, 60).describe("B04"),
    mod: z.enum(["55", "65"]).describe("B06"),
    serie: zCustom.string.numeric().length(3).describe("B07"),
    nNF: zCustom.string.numeric().min(1).max(9).describe("B08"),
    dhEmi: zCustom.string
      .date()
      .refine((date) => new Date(date) <= new Date(), {
        message: "Data e hora de emissão não pode ser futura",
      })
      .describe("B09"),
    dhSaiEnt: zCustom.string
      .date()
      .refine((date) => new Date(date) <= new Date(), {
        message:
          "Data e hora de Saída ou da Entrada da Mercadoria/Produto não pode ser futura",
      })
      .optional()
      .describe("B10"),
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
    dhCont: zCustom.string
      .date()
      .refine((date) => new Date(date) <= new Date(), {
        message: "Data de emissão não pode ser futura",
      })
      .optional()
      .describe("B28"),
    xJust: zCustom.string.range(15, 256).optional().describe("B29"),
    NFref: z.array(schemaNfeNfRef).max(500).optional(),
  })
  .refine(
    ({ mod, dhSaiEnt }) => {
      if (mod === "65") {
        return dhSaiEnt === undefined;
      }
      return true;
    },
    {
      message:
        "Data e hora de Saída ou da Entrada da Mercadoria/Produto não deve ser informada para NFC-e.",
    },
  )
  .refine(({ cNF, nNF }) => cNF !== nNF, {
    message: "O código numérico da NF-e não pode ser igual ao número da NF-e.",
  })
  .describe("ide:B01");

type NfeIde = z.infer<typeof schemaNfeIde>;

/**
 * @description Grupo B. Identificação da Nota Fiscal eletrônica
 */
export { schemaNfeIde, type NfeIde };
