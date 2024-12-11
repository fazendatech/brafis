import { z } from "zod";
import { zCustom } from "@/utils/zCustom";

const schemaNfePag = z
  .object({
    detPag: z
      .array(
        z.object({
          indPag: z.enum(["0", "1"]).optional().describe("YA01b"),
          tPag: z
            .enum([
              "01",
              "02",
              "03",
              "04",
              "05",
              "10",
              "11",
              "12",
              "13",
              "15",
              "16",
              "17",
              "18",
              "19",
              "90",
              "99",
            ])
            .describe("YA02"),
          vPag: zCustom.decimal(13, 2).describe("YA03"),
          card: z
            .object({
              tpIntegra: z.enum(["1", "2"]).optional().describe("YA04a"),
              CNPJ: zCustom.cnpj().optional().describe("YA05"),
              tBand: z
                .enum([
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "99",
                ])
                .optional()
                .describe("YA06"),
              cAut: zCustom.length(1, 20).optional().describe("YA07"),
              vTroco: zCustom.decimal(13, 2).optional().describe("YA09"),
            })
            .optional()
            .describe("YA04"),
        }),
      )
      .min(1)
      .max(100)
      .describe("YA01a"),
  })
  .describe("pag:YA01");

/**
 * @description Grupo YA. Informações de Pagamento
 */
type NfePag = z.infer<typeof schemaNfePag>;

export { schemaNfePag, type NfePag };
