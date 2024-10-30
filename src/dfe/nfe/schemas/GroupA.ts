import { z } from "zod";

import { schemaNfeIde } from "./GroupB";
import { schemaNfeEmit } from "./GroupC";
import { schemaNfeAvulsa } from "./GroupD";
import { schemaNfeDest } from "./GroupE";
import { schemaNfeRetirada } from "./GroupF";
import { schemaNfeEntrega } from "./GroupG";

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