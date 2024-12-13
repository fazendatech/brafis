import { z } from "zod";
import { schemaNfeInfNfe } from "./groupA";

const schemaNfe = z
  .object({
    NFe: z.object({
      "@_xmlns": z.literal("http://www.portalfiscal.inf.br/nfe"),
      infNFe: schemaNfeInfNfe,
    }),
  })
  .describe("NFe (TAG Raíz)");

/**
 * @description Tipo que infere a estrutura da NFe.
 */
export type NfeLayout = z.infer<typeof schemaNfe>;

/**
 * @description Realiza a validação da NFe.
 *
 * @param {NfeLayout} nfe - Objeto NFe.
 *
 * @returns {NfeLayout} O próprio objeto da NFe passada como parâmetro.
 * @throws {Zod.ZodError} Se a NFe não for válida.
 */
export function parseNfe(nfe: NfeLayout): NfeLayout {
  return schemaNfe.parse(nfe);
}