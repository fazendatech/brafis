import { zCustom } from "@/utils/zCustom";
import { z } from "zod";
import { schemaNfeNfRef } from "./groupBa";
import { zUfCode } from "./misc";

const invalidCnfs = new Set([
  "00000000",
  "11111111",
  "22222222",
  "33333333",
  "44444444",
  "55555555",
  "66666666",
  "77777777",
  "88888888",
  "99999999",
  "12345678",
  "23456789",
  "34567890",
  "45678901",
  "56789012",
  "67890123",
  "78901234",
  "89012345",
  "90123456",
  "01234567",
]);

const schemaNfeIde = z
  .object({
    cUF: zUfCode().describe("B02"),
    cNF: zCustom
      .numeric()
      .length(8)
      .refine((cNF) => !invalidCnfs.has(cNF), {
        message: "Código numérico em formato inválido.",
      })
      .describe("B03"),
    natOp: zCustom.length(1, 60).describe("B04"),
    mod: z.enum(["55", "65"]).describe("B06"),
    serie: zCustom.numeric().length(3).describe("B07"),
    nNF: zCustom.numeric().min(1).max(9).describe("B08"),
    dhEmi: zCustom.date().describe("B09"),
    dhSaiEnt: zCustom.date().optional().describe("B10"),
    tpNF: z.enum(["0", "1"]).describe("B11"),
    idDest: z.enum(["1", "2", "3"]).describe("B11a"),
    cMunFG: zCustom.numeric().length(7).describe("B12"),
    tpImp: z.enum(["0", "1", "2", "3", "4", "5"]).describe("B21"),
    tpEmis: z.enum(["1", "2", "3", "4", "5", "6", "7", "9"]).describe("B22"),
    cDV: zCustom.numeric().length(1).describe("B23"),
    tpAmb: z.enum(["1", "2"]).describe("B24"),
    finNFe: z.enum(["1", "2", "3", "4"]).describe("B25"),
    indFinal: z.enum(["0", "1"]).describe("B25a"),
    indPres: z.enum(["0", "1", "2", "3", "4", "5", "9"]).describe("B25b"),
    indIntermed: z.enum(["0", "1"]).optional().describe("B25c"),
    procEmi: z.enum(["0", "1", "2", "3"]).describe("B26"),
    verProc: zCustom.length(1, 20).describe("B27"),
    dhCont: zCustom.date().optional().describe("B28"),
    xJust: zCustom.length(15, 256).optional().describe("B29"),
    NFref: z.array(schemaNfeNfRef).max(500).optional(),
  })
  .refine(({ mod, dhSaiEnt }) => (mod === "65" ? !dhSaiEnt : true), {
    message:
      "Data e hora de Saída ou da Entrada da Mercadoria/Produto não deve ser informada para NFC-e.",
  })
  .refine(
    ({ tpNF, dhSaiEnt, dhEmi }) => {
      if (!dhSaiEnt || tpNF !== "1") {
        return true;
      }
      return new Date(dhSaiEnt) >= new Date(dhEmi);
    },
    {
      message:
        "Data e hora de Saída ou da Entrada da Mercadoria/Produto deve ser maior ou igual a Data e hora de Emissão.",
    },
  )
  .refine(({ cNF, nNF }) => Number(cNF) !== Number(nNF), {
    message: "O código numérico da NF-e não pode ser igual ao número da NF-e.",
  })
  .describe("ide:B01");

type NfeIde = z.infer<typeof schemaNfeIde>;

/**
 * @description Grupo B. Identificação da Nota Fiscal eletrônica
 */
export { schemaNfeIde, type NfeIde };
