import { isValidAccessCode } from "@/utils/validators/isValidAccessCode";
import { z } from "zod";
import { schemaNfeIde } from "./groupB";
import { schemaNfeEmit } from "./groupC";
import { schemaNfeAvulsa } from "./groupD";
import { schemaNfeDest } from "./groupE";
import { schemaNfeRetirada } from "./groupF";
import { schemaNfeEntrega } from "./groupG";
import { schemaNfeAutXml } from "./groupGa";
import { schemaNfeDet } from "./groupH";
import { schemaNfeTotal } from "./groupW";
import { schemaNfeTransp } from "./groupX";
import { schemaNfeCobr } from "./groupY";
import { schemaNfePag } from "./groupYa";
import { schemaNfeInfIntermed } from "./groupYb";
import { schemaNfeInfAdic } from "./groupZ";
import { schemaNfeInfRespTec } from "./groupZd";

const schemaNfeInfNfe = z
  .object({
    "@_versao": z.literal("4.00").describe("A02"),
    "@_Id": z
      .string()
      .startsWith("NFe")
      .length(47)
      .refine((value) => isValidAccessCode(value.slice(3), { strict: true }), {
        message: "O Id da nota está em formato inválido.",
      })
      .describe("A03"),
    ide: schemaNfeIde,
    emit: schemaNfeEmit,
    avulsa: schemaNfeAvulsa.optional(),
    dest: schemaNfeDest,
    retirada: schemaNfeRetirada.optional(),
    entrega: schemaNfeEntrega.optional(),
    autXML: z.array(schemaNfeAutXml).max(10).optional(),
    det: z
      .array(schemaNfeDet)
      .min(1)
      .max(990)
      .refine(
        (array) =>
          array.every(({ "@_nItem": nItem }, i) => Number(nItem) === i + 1),
        { message: "nItem deve ser sequencial a partir de 1" },
      ),
    total: schemaNfeTotal,
    transp: schemaNfeTransp,
    cobr: schemaNfeCobr.optional(),
    pag: schemaNfePag,
    infIntermed: schemaNfeInfIntermed.optional(),
    infAdic: schemaNfeInfAdic.optional(),
    infRespTec: schemaNfeInfRespTec.optional(),
  })
  .refine(({ ide, dest }) => (ide.mod === "55" ? !!dest.xNome : true), {
    message: "dest.xNome é obrigatório para a NF-e (modelo 55).",
  })
  .refine(
    ({ ide, dest }) =>
      ide.mod === "65" ? dest.indIEDest === "9" && !dest.IE : true,
    {
      message:
        "No caso de NFC-e (modelo 65) informar dest.indIEDest=9 e não informar a tag dest.IE",
    },
  )
  .refine(({ ide, "@_Id": id }) => ide.cDV === id.slice(-1), {
    message:
      "O dígito verificador do Id da nota deve ser igual ao campo cDV da tag ide.",
  })
  .describe("infNFe:A01");

/**
 * @description Grupo A. Dados da Nota Fiscal eletrônica
 */
type NfeInfNfe = z.infer<typeof schemaNfeInfNfe>;

export { schemaNfeInfNfe, type NfeInfNfe };
