import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { schemaNfeProd } from "./groupI";
import { schemaNfeImposto } from "./groupM";

const schemaNfeDet = z
  .object({
    nItem: zCustom
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
    // impostoDevol: schemaNfeImpostoDevol.optional(),
    infAdProd: z.string().max(500).optional().describe("H05"),
  })
  .describe("det:H01");

/**
 * @description Grupo H. Detalhamento de Produtos e Serviços da NF-e
 */
type NfeDet = z.infer<typeof schemaNfeDet>;

export { schemaNfeDet, type NfeDet };
