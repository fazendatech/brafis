import { zCustom } from "@/utils/zCustom";
import { z } from "zod";

const schemaNfeDet = z
  .object({
    nItem: zCustom.string
      .numeric()
      .max(3)
      .refine((value) => {
        const num = Number.parseInt(value);
        return num > 0 && num <= 990;
      })
      .describe("H02"),
  })
  .describe("det:H01");

type NfeDet = z.infer<typeof schemaNfeDet>;

/**
 * @description Grupo H. Detalhamento de Produtos e Serviços da NF-e
 */
export { schemaNfeDet, type NfeDet };
