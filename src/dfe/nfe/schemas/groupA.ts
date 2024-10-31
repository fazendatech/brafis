import { z } from "zod";

import { schemaNfeIde } from "./groupB";
import { schemaNfeEmit } from "./groupC";
import { schemaNfeAvulsa } from "./groupD";
import { schemaNfeDest } from "./groupE";
import { schemaNfeRetirada } from "./groupF";
import { schemaNfeEntrega } from "./groupG";
import { schemaNfeAutXml } from "./groupGA";
import { schemaNfeDet } from "./groupH";

const schemaNfeInfNfe = z
  .object({
    "@_versao": z.literal("4.00").describe("A02"),
    Id: z.string().startsWith("NFe").length(47).describe("A03"), // TODO: Validar
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
        for (let i = 0; i < array.length; i++) {
          if (Number.parseInt(array[i].nItem) !== i + 1) {
            return false;
          }
        }
        return true;
      }),
  })
  .refine(
    (obj) =>
      (obj.ide.mod === "55" ? obj.dest.xNome : true) && // dest.xNome obrigatório para a NF-e (modelo 55) e opcional para a NFC-e.
      (obj.ide.mod === "65"
        ? obj.dest.indIEDest === "9" && !obj.dest.IE
        : true), //No caso de NFC-e (ide.mod->65) informar dest.indIEDest=9 e não informar a tag Idest.E
  )
  .describe("infNFe:A01");

type NfeInfNfe = z.infer<typeof schemaNfeInfNfe>;

/**
 * @description Grupo A. Dados da Nota Fiscal eletrônica
 */
export { schemaNfeInfNfe, type NfeInfNfe };
