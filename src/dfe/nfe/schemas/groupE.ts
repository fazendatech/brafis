import { z } from "zod";

import { zCustom } from "@/utils/zCustom";

import { zUf } from "./groupC";

const schemaEnderDest = z
  .object({
    xLgr: zCustom.string.range(2, 60).describe("E06"),
    nro: zCustom.string.range(1, 60).describe("E07"),
    xCpl: zCustom.string.range(1, 60).optional().describe("E08"),
    xBairro: zCustom.string.range(2, 60).describe("E09"),
    cMun: zCustom.string.numeric().length(7).describe("E10"),
    xMun: zCustom.string.range(2, 60).describe("E11"), // Nome do município ou "EXTERIOR"
    UF: zUf().or(z.literal("EX")).describe("E12"), // "EX" - Operações no exterior
    CEP: zCustom.string.numeric().length(8).optional().describe("E13"),
    cPais: zCustom.string.numeric().min(2).max(4).optional().describe("E14"), // TODO: Validar - utilizar a Tabela do BACEN (Seção 8.3 do MOC – Visão Geral, Tabela de UF, Município e País).
    xPais: zCustom.string.range(2, 60).optional().describe("E15"),
    fone: zCustom.string.phone().optional().describe("E16"), // Telefone
  })
  .refine((obj) => (obj.xMun === "EXTERIOR" ? obj.UF === "EX" : true)) // TODO: cPais e xPais !== Brasil
  .describe("enderDest:E05");

const schemaNfeDest = z
  .object({
    CNPJ: zCustom.string.cnpj().optional().describe("E02"),
    CPF: zCustom.string.cpf().optional().describe("E03"),
    idEstrangeiro: zCustom.string.range(5, 20).optional().describe("E03a"),
    xNome: zCustom.string.range(2, 60).optional().describe("E04"), // Obrigatório para a NF-e (modelo 55) e opcional para a NFC-e.
    enderDest: schemaEnderDest,
    indIEDest: z.enum(["1", "2", "9"]).describe("E16a"), //Nota 1: No caso de NFC-e informar indIEDest=9 e não informar a tag IE do destinatário;
    IE: zCustom.string.ie().optional().describe("E17"),
    // TODO: Validar? - Obrigatório, nas operações que se beneficiam de incentivos fiscais existentes nas áreas sob controle da SUFRAMA. A omissão desta informação impede o processamento da operação pelo Sistema de Mercadoria Nacional da SUFRAMA e a liberação da Declaração de Ingresso, prejudicando a comprovação do ingresso internamento da mercadoria nestas áreas. (v2.0)
    ISUF: zCustom.string.range(8, 9).optional().describe("E18"),
    IM: zCustom.string.range(1, 15).optional().describe("E18a"),
    email: zCustom.string.range(1, 60).email().optional().describe("E19"),
  })
  .refine(
    (obj) =>
      zCustom.utils.hasOnlyOne([obj.CNPJ, obj.CPF, obj.idEstrangeiro]) &&
      (obj.idEstrangeiro ? obj.enderDest?.xMun === "EXTERIOR" : true) && //idEstrangeiro somente em operações no exterior
      (obj.idEstrangeiro ? obj.indIEDest === "9" && !obj.IE : true) && //No caso de operação com o Exterior informar indIEDest=9 e não informar a tag IE do destinatário;
      (obj.indIEDest === "1" ? obj.IE : true) && // 1=Contribuinte ICMS (informar a IE do destinatário);
      (obj.indIEDest === "2" ? !obj.IE : true), // No caso de Contribuinte Isento de Inscrição (indIEDest=2), não informar a tag IE do destinatário
  )
  .describe("dest:E01");

type NfeDest = z.infer<typeof schemaNfeDest>;

/**
 * @description Grupo E. Identificação do Destinatário da Nota Fiscal eletrônica
 */
export { schemaNfeDest, type NfeDest };
