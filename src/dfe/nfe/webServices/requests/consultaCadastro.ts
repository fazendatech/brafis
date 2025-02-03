import type { Uf, UfCode } from "@/ufCode/types";
import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";
import { zCustom } from "@/utils/zCustom";
import { z } from "zod";
import type { NfeResultMsg } from "./common";

export const schemaNfeConsultaCadastroOptions = z
  .object({
    IE: zCustom.ie().optional(),
    CPF: zCustom.cpf().optional(),
    CNPJ: zCustom.cnpj().optional(),
  })
  .refine((obj) => zCustom.utils.hasOnlyOne([obj.IE, obj.CPF, obj.CNPJ]), {
    message: "Deve ser usado apenas um dos campos IE, CNPJ ou CPF.",
  });

/**
 * @description Opções para configurar o web service de consulta cadastro. Deve ser usado um, e apenas um, dos campos IE, CNPJ ou CPF.
 *
 * @property {string} [IE] - Inscrição Estadual.
 * @property {string} [CNPJ] - CNPJ.
 * @property {string} [CPF] - CPF.
 */
export type NfeConsultaCadastroOptions = z.infer<
  typeof schemaNfeConsultaCadastroOptions
>;

export interface NfeConsultaCadastroRequest {
  nfeDadosMsg: WithXmlns<{
    ConsCad: WithXmlnsVersao<{
      infCons: {
        xServ: "CONS-CAD";
        UF: Uf;
        IE?: string;
        CNPJ?: string;
        CPF?: string;
      };
    }>;
  }>;
}

/**
 * @description Endereço do contribuinte.
 *
 * @property {string} [xLgr] - Logradouro.
 * @property {string} [Nro] - Número.
 * @property {string} [xCpl] - Complemento.
 * @property {string} [xBairro] - Bairro.
 * @property {string} [cMun] - Código do Município.
 * @property {string} [xMun] - Nome do Município.
 * @property {string} [CEP] - CEP.
 */
export interface Ender {
  xLgr?: string;
  Nro?: string;
  xCpl?: string;
  xBairro?: string;
  cMun?: string;
  xMun?: string;
  CEP?: string;
}

/**
 * @description Informações do cadastro.
 *
 * @property {string} IE - Inscrição Estadual.
 * @property {string} [CNPJ] - CNPJ.
 * @property {string} [CPF] - CPF.
 * @property {Uf} UF - Sigla da UF.
 * @property {"0"|"1"} cSit - Código da situação cadastral: `0=não habilitado` ou `1=habilitado`.
 * @property {"0"|"1"|"2"|"3"|"4"} indCredNFe - `0=Não credenciado para emissão da NF-e`, `1=Credenciado`, `2=Credenciado com obrigatoriedade para todas operações`, `3=Credenciado com obrigatoriedade parcial`, `4=a SEFAZ não fornece a informação`.
 * @property {"0"|"1"|"2"|"3"|"4"} indCredCTe - `0=Não credenciado para emissão de CT-e`, `1=Credenciado`, `2=Credenciado com obrigatoriedade para todas operações`, `3=Credenciado com obrigatoriedade parcial`, `4=a SEFAZ não fornece a informação`.
 * @property {string} xNome - Razão Social ou Nome do Contribuinte.
 * @property {string} [xFant] - Nome Fantasia.
 * @property {string} [xRegApur] - Regime de Apuração do ICMS.
 * @property {string} [CNAE] - Código CNAE principal.
 * @property {string} [dIniAtiv] - Data de Início de Atividades.
 * @property {string} [dUltSit] - Data da última situação cadastral.
 * @property {string} [dBaixa] - Data de Baixa.
 * @property {string} [IEUnica] - Inscrição Estadual Única.
 * @property {string} [IEAtual] - Inscrição Estadual Atual.
 * @property {Ender} [Ender] - Endereço.
 */
export interface InfCad {
  IE: string;
  CNPJ?: string;
  CPF?: string;
  UF: Uf;
  cSit: "0" | "1";
  indCredNFe: "0" | "1" | "2" | "3" | "4";
  indCredCTe: "0" | "1" | "2" | "3" | "4";
  xNome: string;
  xFant?: string;
  xRegApur?: string;
  CNAE?: string;
  dIniAtiv?: string;
  dUltSit?: string;
  dBaixa?: string;
  IEUnica?: string;
  IEAtual?: string;
  Ender?: Ender;
}

/**
 * @description Informações da consulta.
 *
 * @property {string} verAplic - Versão do aplicativo que processou a consulta.
 * @property {string} cStat - Código do status da resposta.
 * @property {string} xMotivo - Descrição da resposta.
 * @property {Uf} UF - Sigla da UF consultada.
 * @property {string} [IE] - Inscrição Estadual.
 * @property {string} [CNPJ] - CNPJ.
 * @property {string} [CPF] - CPF.
 * @property {string} dhCons - Data e hora da consulta.
 * @property {UfCode} cUF - Código da UF que atendeu a solicitação.
 * @property {InfCad[]} infCad  - Informações do cadastro.
 */
export interface InfCons {
  verAplic: string;
  cStat: LiteralStringUnion<
    | "111"
    | "112"
    | "257"
    | "258"
    | "259"
    | "260"
    | "261"
    | "262"
    | "263"
    | "264"
    | "265"
  >;
  xMotivo: string;
  UF: Uf;
  IE?: string;
  CNPJ?: string;
  CPF?: string;
  dhCons: string;
  cUF: UfCode;
  infCad: InfCad[];
}

/**
 * @description Resposta da consulta de cadastro.
 *
 * @property {string} @_versao - Versão do schema.
 * @property {InfCons} infCons - Dados da consulta.
 */
export interface RetConsCad {
  "@_versao": string;
  infCons: InfCons;
}

/**
 * @description Resposta completa da consulta de cadastro.
 *
 * @property {RetConsCad} nfeResultMsg.retConsCad - Informações da consulta.
 */
export type NfeConsultaCadastroResponse = NfeResultMsg<{
  retConsCad: RetConsCad;
}>;
