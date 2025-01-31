import { zCustom } from "@/utils/zCustom";
import { z } from "zod";
import { schemaNfeProd } from "./groupI";
import { schemaNfeImposto } from "./groupM";

const schemaNfeDet = z
  .object({
    "@_nItem": zCustom
      .numeric()
      .max(3)
      .refine(
        (value) => {
          const num = Number(value);
          return num >= 1 && num <= 990;
        },
        { message: "Deve estar entre 1 e 990." },
      )
      .describe("H02"),
    prod: schemaNfeProd,
    imposto: schemaNfeImposto,
    impostoDevol: z
      .object({
        pDevol: zCustom.decimal(3, 2).describe("UA02"),
        IPI: z
          .object({
            vIPIDevol: zCustom.decimal(13, 2).describe("UA03"),
          })
          .optional()
          .describe("UA04"),
      })
      .optional()
      .describe("UA01"),
    infAdProd: zCustom.length(1, 500).optional().describe("H05"),
  })
  .describe("det:H01");

/**
 * @description Grupo H. Detalhamento de Produtos e Serviços da NF-e
 */
type NfeDet = z.infer<typeof schemaNfeDet>;

export { schemaNfeDet, type NfeDet };
