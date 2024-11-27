import { z } from "zod";

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

function verifierDigit(digits: string): number {
  let factor = 4;
  let sum = 0;
  for (const d of digits) {
    sum += Number(d) * factor;
    factor -= 1;
    if (factor === 1) {
      factor = 9;
    }
  }
  const dv = 11 - (sum % 11);
  return dv > 9 ? 0 : dv;
}

const schemaNfeInfNfe = z
  .object({
    "@_versao": z.literal("4.00").describe("A02"),
    "@_Id": z
      .string()
      .startsWith("NFe")
      .length(47)
      .refine(
        (value) =>
          Number(value.slice(-1)) === verifierDigit(value.slice(0, -1)),
      )
      .describe("A03"),
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
      .refine(
        (array) => array.every(({ nItem }, i) => Number(nItem) === i + 1),
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
  .describe("infNFe:A01");

/**
 * @description Grupo A. Dados da Nota Fiscal eletrônica
 */
type NfeInfNfe = z.infer<typeof schemaNfeInfNfe>;

export { schemaNfeInfNfe, type NfeInfNfe };
