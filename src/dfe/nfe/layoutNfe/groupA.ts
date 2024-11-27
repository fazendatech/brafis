import { z } from "zod";

import { validateVerifierDigit } from ".";
import { schemaNfeIde } from "./groupB";
import { schemaNfeEmit } from "./groupC";
import { schemaNfeAvulsa } from "./groupD";
import { schemaNfeDest } from "./groupE";
import { schemaNfeRetirada } from "./groupF";
import { schemaNfeEntrega } from "./groupG";
import { schemaNfeAutXml } from "./groupGA";
import { schemaNfeDet } from "./groupH";
import { schemaNfeTotal } from "./groupW";
import { schemaNfeTransp } from "./groupX";
import { schemaNfeCobr } from "./groupY";
import { schemaNfePag } from "./groupYA";
import { schemaNfeInfIntermed } from "./groupYB";
import { schemaNfeInfAdic } from "./groupZ";
import { schemaNfeInfRespTec } from "./groupZD";

const schemaNfeInfNfe = z
  .object({
    "@_versao": z.literal("4.00").describe("A02"),
    "@_Id": z
      .string()
      .startsWith("NFe")
      .length(47)
      .refine(validateVerifierDigit)
      .describe("A03"), // TODO: Validar
    ide: schemaNfeIde,
    emit: schemaNfeEmit,
    avulsa: schemaNfeAvulsa.optional(),
    dest: schemaNfeDest,
    retirada: schemaNfeRetirada.optional(),
    entrega: schemaNfeEntrega.optional(),
    autXml: z.array(schemaNfeAutXml).max(10).optional(),
    det: z
      .array(schemaNfeDet)
      .min(1)
      .max(990)
      .refine((array) => {
        array.every(({ nItem }, i) => Number(nItem) === i + 1);
      }),
    total: schemaNfeTotal,
    transp: schemaNfeTransp,
    cobr: schemaNfeCobr.optional(),
    pag: schemaNfePag,
    infIntermed: schemaNfeInfIntermed.optional(),
    infAdic: schemaNfeInfAdic.optional(),
    infRespTec: schemaNfeInfRespTec.optional(),
  })
  .refine(
    ({ ide: { mod }, dest: { xNome } }) => {
      if (mod === "55") {
        return xNome !== undefined;
      }
      return true;
    },
    {
      message: "dest.xNome é obrigatório para a NF-e (modelo 55).",
    },
  )
  .refine(
    ({ ide: { mod }, dest: { indIEDest, IE } }) => {
      if (mod === "65") {
        return indIEDest === "9" && !IE;
      }
      return true;
    },
    {
      message:
        "No caso de NFC-e (modelo 65) informar dest.indIEDest=9 e não informar a tag dest.IE",
    },
  )
  .describe("infNFe:A01");

/**
 * @description Grupo A. Dados da Nota Fiscal eletrônica
 */
type NfeInfNfe = z.infer<typeof schemaNfeInfNfe>;

export { schemaNfeInfNfe, type NfeInfNfe };
