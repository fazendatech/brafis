import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { schemaNfeProd } from "./groupI";

const schemaNfeDet = z
  .object({
    nItem: zCustom.string
      .numeric()
      .max(3)
      .refine(
        (value) => {
          const num = Number(value);
          return num > 0 && num <= 990;
        },
        { message: "Deve ser maior que 0 e menor ou igual a 990." },
      )
      .describe("H02"),
    prod: schemaNfeProd,
    // imposto: schemaNfeImposto,
    // impostoDevol: schemaNfeImpostoDevol.optional(),
    infAdProd: z.string().max(500).optional().describe("H05"),
  })
  .describe("det:H01");

/**
 * @description Grupo H. Detalhamento de Produtos e Serviços da NF-e
 */
type NfeDet = z.infer<typeof schemaNfeDet>;

export { schemaNfeDet, type NfeDet };
