import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUf } from ".";

const schemaNfeDi = z
  .object({
    nDI: zCustom.length(1, 12).describe("I19"),
    dDI: z.string().date().describe("I20"),
    xLocDesemb: zCustom.length(1, 60).describe("I21"),
    UFDesemb: zUf().describe("I22"),
    dDesemb: z.string().date().describe("I23"),
    tpViaTransp: z.enum(["1", "2", "3", "4", "5", "6", "7"]).describe("I23a"),
    vAFRMM: zCustom.decimal(13, 2).optional().describe("I23b"),
    tpIntermedio: z.enum(["1", "2", "3"]).describe("I23c"),
    CNPJ: zCustom.cnpj().optional().describe("I23d"),
    UFTerceiro: zUf().optional().describe("I23e"),
    cExportador: zCustom.length(1, 60).describe("I24"),
    adi: z
      .array(
        z.object({
          nAdicao: zCustom.numeric().min(1).max(3).describe("I26"),
          nSeqAdic: zCustom.numeric().min(1).max(3).describe("I27"),
          cFabricante: zCustom.length(1, 60).describe("I28"),
          vDescDI: zCustom.decimal(13, 2).optional().describe("I29"),
          nDraw: zCustom
            .numeric()
            .refine((value) => value.length === 9 || value.length === 11, {
              message:
                "O número do Ato Concessório de Suspensão deve ser preenchido com 11 dígitos (AAAANNNNNND) e o número do Ato Concessório de Drawback Isenção deve ser preenchido com 9 dígitos (AANNNNNND).",
            })
            .optional()
            .describe("I29a"),
        }),
      )
      .min(1)
      .max(100)
      .describe("I25"),
  })
  .refine(
    ({ tpViaTransp, vAFRMM }) => (tpViaTransp === "1" ? !!vAFRMM : true),
    {
      message:
        "O campo vAFRMM é obrigatório quando tpViaTransp é igual a 1 (Transporte maritmo).",
    },
  )
  .refine(
    ({ tpIntermedio, CNPJ, UFTerceiro }) => {
      if (tpIntermedio === "1") {
        return true;
      }
      return !!CNPJ && !!UFTerceiro;
    },
    {
      message:
        "Os campos CNPJ e UFTerceiro são obrigatórios quando tpIntermedio é igual a 1 (Importação por conta e ordem ou por encomenda).",
    },
  )
  .describe("DI:I18");

/**
 * @description Grupo I01. Declaração de Importação
 */
type NfeDi = z.infer<typeof schemaNfeDi>;

export { schemaNfeDi, type NfeDi };
