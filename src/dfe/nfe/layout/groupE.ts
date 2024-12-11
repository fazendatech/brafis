import { z } from "zod";
import { zCustom } from "@/utils/zCustom";
import { zUf } from "./misc";

const schemaNfeDest = z
  .object({
    CNPJ: zCustom.cnpj().optional().describe("E02"),
    CPF: zCustom.cpf().optional().describe("E03"),
    idEstrangeiro: zCustom.length(5, 20).optional().describe("E03a"),
    xNome: zCustom.length(2, 60).optional().describe("E04"),
    enderDest: z
      .object({
        xLgr: zCustom.length(2, 60).describe("E06"),
        nro: zCustom.length(1, 60).describe("E07"),
        xCpl: zCustom.length(1, 60).optional().describe("E08"),
        xBairro: zCustom.length(2, 60).describe("E09"),
        cMun: zCustom.numeric().length(7).describe("E10"),
        xMun: zCustom.length(2, 60).describe("E11"),
        UF: zUf().or(z.literal("EX")).describe("E12"),
        CEP: zCustom.numeric().length(8).optional().describe("E13"),
        cPais: zCustom.numeric().min(2).max(4).optional().describe("E14"),
        xPais: zCustom.length(2, 60).optional().describe("E15"),
        fone: zCustom.phone().optional().describe("E16"),
      })
      .refine(
        ({ cPais, xPais }) => {
          if (cPais === "1058") {
            return xPais === "BRASIL" || xPais === "Brasil";
          }
          return true;
        },
        { message: "Para cPais='1058', xPais deve ser 'BRASIL' ou 'Brasil'." },
      )
      .refine(
        ({ cPais, xMun, UF }) => {
          if (cPais === "1058") {
            return true;
          }
          if (xMun === "EXTERIOR" && UF === "EX") {
            return true;
          }
          if (xMun !== "EXTERIOR" && UF !== "EX") {
            return true;
          }
          return false;
        },
        {
          message:
            "Se a operação é no exterior, então xMun deve ser 'EXTERIOR' e UF='EX'.",
        },
      )
      .describe("enderDest:E05"),
    indIEDest: z.enum(["1", "2", "9"]).describe("E16a"),
    IE: zCustom.ie().optional().describe("E17"),
    ISUF: zCustom.length(8, 9).optional().describe("E18"),
    IM: zCustom.length(1, 15).optional().describe("E18a"),
    email: zCustom.length(1, 60).email().optional().describe("E19"),
  })
  .refine(
    ({ CNPJ, CPF, idEstrangeiro }) =>
      zCustom.utils.hasOnlyOne(CNPJ, CPF, idEstrangeiro),
    {
      message:
        "Deve ser informado apenas um dos campos: CNPJ, CPF ou idEstrangeiro.",
    },
  )
  .refine(
    ({ idEstrangeiro, enderDest }) =>
      idEstrangeiro ? enderDest.xMun === "EXTERIOR" : true,
    {
      message:
        "Se informado idEstrangeiro então a operação deve ser identificada como no exterior.",
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
        "Para operações com o exterior, 'indIEDest' deve ser '9' e 'IE' não deve ser informada.",
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
