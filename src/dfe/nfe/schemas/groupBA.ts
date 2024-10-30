import { zCustom } from "@/utils/zCustom";

import { z } from "zod";

import { zUfCode } from "./groupB";

const isValidAamm = (aamm: string) => {
  const month = Number.parseInt(aamm.slice(2, 4));
  return month >= 1 && month <= 12;
};
const schemaAAMM = () =>
  zCustom.string
    .numeric()
    .length(4)
    .refine((value) => isValidAamm(value));

const schemaSerie = () => zCustom.string.numeric().min(1).max(3); // Informar '0' se não utilizada série
const schemaNnf = () => zCustom.string.numeric().min(1).max(9); // Faixa: 1–999999999

const schemaRefNF = z.object({
  cUF: zUfCode().describe("BA04"),
  AAMM: schemaAAMM().describe("BA05"),
  CNPJ: zCustom.string.cnpj().describe("BA06"),
  mod: z.enum(["01", "02"]).describe("BA07"), // 01=modelo 01; 02=modelo 02 (incluído na NT2016.002)
  serie: schemaSerie().describe("BA08"),
  nNF: schemaNnf().describe("BA09"),
});

const schemaRefNFP = z
  .object({
    cUF: zUfCode().describe("BA11"),
    AAMM: schemaAAMM().describe("BA12"),
    CNPJ: zCustom.string.cnpj().optional().describe("BA13"),
    CPF: zCustom.string.cpf().optional().describe("BA14"),
    IE: zCustom.string.ie().describe("BA15"),
    mod: z.enum(["04", "01"]).describe("BA16"), //04=NF de Produtor; 01=NF (v2.0)
    serie: schemaSerie().describe("BA17"),
    nNF: schemaNnf().describe("BA18"),
  })
  .refine((obj) => zCustom.utils.hasOnlyOne([obj.CNPJ, obj.CPF]));

const schemaRefECF = z.object({
  // "2B"=Cupom Fiscal emitido por máquina registradora (não ECF);
  // "2C"=Cupom Fiscal PDV;
  // "2D"=Cupom Fiscal (emitido por ECF) (v2.0).
  mod: z.enum(["2B", "2C", "2D"]).describe("BA21"),
  nECF: zCustom.string.numeric().length(3).describe("BA22"),
  nCOO: zCustom.string.numeric().length(6).describe("BA23"),
});

const schemaNfeNfRef = z
  .object({
    refNfe: zCustom.string.numeric().length(44).optional().describe("BA02"),
    refNF: schemaRefNF.optional().describe("BA03"),
    refNFP: schemaRefNFP.optional().describe("BA10"),
    refCTe: zCustom.string.numeric().length(44).optional().describe("BA19"),
    refECF: schemaRefECF.optional().describe("BA20"),
  })
  .refine((obj) =>
    zCustom.utils.hasOnlyOne([
      obj.refNfe,
      obj.refNF,
      obj.refNFP,
      obj.refCTe,
      obj.refECF,
    ]),
  )
  .describe("NFref:BA01");

type NfeNfRef = z.infer<typeof schemaNfeNfRef>;

/**
 * @description Grupo BA. Documento Fiscal Referenciado
 */
export { schemaNfeNfRef, type NfeNfRef };
