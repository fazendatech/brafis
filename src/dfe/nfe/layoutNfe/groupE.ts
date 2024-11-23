import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUf } from ".";

const schemaNfeDest = z
  .object({
    CNPJ: zCustom.string.cnpj().optional().describe("E02"),
    CPF: zCustom.string.cpf().optional().describe("E03"),
    idEstrangeiro: zCustom.string.range(5, 20).optional().describe("E03a"),
    xNome: zCustom.string.range(2, 60).optional().describe("E04"),
    enderDest: z
      .object({
        xLgr: zCustom.string.range(2, 60).describe("E06"),
        nro: zCustom.string.range(1, 60).describe("E07"),
        xCpl: zCustom.string.range(1, 60).optional().describe("E08"),
        xBairro: zCustom.string.range(2, 60).describe("E09"),
        cMun: zCustom.string.numeric().length(7).describe("E10"),
        xMun: zCustom.string.range(2, 60).describe("E11"), // Nome do município ou "EXTERIOR"
        UF: zUf().or(z.literal("EX")).describe("E12"), // "EX" - Operações no exterior
        CEP: zCustom.string.numeric().length(8).optional().describe("E13"),
        cPais: zCustom.string
          .numeric()
          .min(2)
          .max(4)
          .optional()
          .describe("E14"), // TODO: Validar - utilizar a Tabela do BACEN (Seção 8.3 do MOC – Visão Geral, Tabela de UF, Município e País).
        xPais: zCustom.string.range(2, 60).optional().describe("E15"),
        fone: zCustom.string.phone().optional().describe("E16"), // Telefone
      })
      .refine(({ xMun, UF }) => {
        // TODO: cPais e xPais !== Brasil
        if (xMun === "EXTERIOR" && UF === "EX") {
          return true;
        }
        if (xMun !== "EXTERIOR" && UF !== "EX") {
          return true;
        }
        return false;
      })
      .describe("enderDest:E05"),
    indIEDest: z.enum(["1", "2", "9"]).describe("E16a"),
    IE: zCustom.string.ie().optional().describe("E17"),
    // TODO: Validar? - Obrigatório, nas operações que se beneficiam de incentivos fiscais existentes nas áreas sob controle da SUFRAMA. A omissão desta informação impede o processamento da operação pelo Sistema de Mercadoria Nacional da SUFRAMA e a liberação da Declaração de Ingresso, prejudicando a comprovação do ingresso internamento da mercadoria nestas áreas. (v2.0)
    ISUF: zCustom.string.range(8, 9).optional().describe("E18"),
    IM: zCustom.string.range(1, 15).optional().describe("E18a"),
    email: zCustom.string.range(1, 60).email().optional().describe("E19"),
  })
  .refine(
    ({ CNPJ, CPF, idEstrangeiro }) =>
      zCustom.utils.hasOnlyOne([CNPJ, CPF, idEstrangeiro]),
    {
      message:
        "Deve ser informado apenas um dos campos: CNPJ, CPF ou idEstrangeiro.",
    },
  )
  .refine(
    ({ idEstrangeiro, enderDest: { xMun } }) => {
      if (idEstrangeiro) {
        //NOTE: Os demais campos referentes ao exterior são validados em enderDest
        return xMun === "EXTERIOR";
      }
      return true;
    },
    {
      message:
        "Se informado idEstrangeiro então a operação deve ser identificada como no exterior",
    },
  )
  .refine(
    ({ idEstrangeiro, indIEDest, IE }) => {
      if (idEstrangeiro) {
        return indIEDest === "9" && !IE;
      }
      return true;
    },
    {
      message:
        "No caso de operação com o exterior deve-se informar indIEDest='9' e não informar a tag IE do destinatário.",
    },
  )
  .refine(
    ({ indIEDest, IE }) => {
      if (indIEDest === "1") {
        return IE;
      }
      if (indIEDest === "2" || indIEDest === "9") {
        return !IE;
      }
      return true;
    },
    {
      message:
        "No caso de Contribuinte ICMS (indIEDest = 1), informar a IE do destinatário, do contrário, indIEDest=2 ou infIEDest=9, não informar a tag IE do destinatário.",
    },
  )
  .describe("dest:E01");

/**
 * @description Grupo E. Identificação do Destinatário da Nota Fiscal eletrônica
 */
type NfeDest = z.infer<typeof schemaNfeDest>;

export { schemaNfeDest, type NfeDest };
