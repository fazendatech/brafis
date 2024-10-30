import { z } from "zod";

import { schemaNfeIde } from "./B";
import { schemaNfeEmit } from "./C";

const schemaNfeInfNfe = z
  .object({
    "@_versao": z.literal("4.00").describe("A02"),
    Id: z.string().startsWith("NFe").length(47).describe("A03"), // TODO: Validar
    ide: schemaNfeIde,
    emit: schemaNfeEmit,
  })
  .describe("infNFe:A01");

type NfeInfNfe = z.infer<typeof schemaNfeInfNfe>;

/**
 * @description Grupo A. Dados da Nota Fiscal eletrônica
 */
export { schemaNfeInfNfe, type NfeInfNfe };
