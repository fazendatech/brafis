import type { UFCode } from "@/ufCode/types";
import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";

import type { NfeWebServiceResponse } from "./common";

/**
 * @description Opções para configurar o web service de consulta cadastro.
 *
 * @property {string} [IE] - Inscrição Estadual.
 * @property {string} [CNPJ] - CNPJ.
 * @property {string} [CPF] - CPF.
 */
export interface NfeConsultaCadastroOptions {
  IE?: string;
  CNPJ?: string;
  CPF?: string;
}

export type NfeConsultaCadastroStatus =
  | "uma-ocorrencia"
  | "multiplas-ocorrencias";

export type NfeConsultaCadastroRequest = WithXmlns<{
  ConsCad: WithXmlnsVersao<{
    infCons: {
      xServ: "CONS-CAD";
      UF: UFCode;
      IE?: string;
      CNPJ?: string;
      CPF?: string;
    };
  }>;
}>;

/**
 * @description Endereço do contribuinte.
 *
 * @property [xLgr] - Logradouro.
 * @property [Nro] - Número.
 * @property [xCpl] - Complemento.
 * @property [xBairro] - Bairro.
 * @property [cMun] - Código do Município.
 * @property [xMun] - Nome do Município.
 * @property [CEP] - CEP.
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
 * @property IE - Inscrição Estadual.
 * @property [CNPJ] - CNPJ.
 * @property [CPF] - CPF.
 * @property UF - Sigla da UF.
 * @property cSit - Código da situação cadastral: `0=não habilitado` ou `1=habilitado`.
 * @property indCredNFe - `0=Não credenciado para emissão da NF-e`, `1=Credenciado`, `2=Credenciado com obrigatoriedade para todas operações`, `3=Credenciado com obrigatoriedade parcial`, `4=a SEFAZ não fornece a informação`.
 * @property indCredCTe - `0=Não credenciado para emissão de CT-e`, `1=Credenciado`, `2=Credenciado com obrigatoriedade para todas operações`, `3=Credenciado com obrigatoriedade parcial`, `4=a SEFAZ não fornece a informação`.
 * @property xNome - Razão Social ou Nome do Contribuinte.
 * @property [xFant] - Nome Fantasia.
 * @property [xRegApur] - Regime de Apuração do ICMS.
 * @property [CNAE] - Código CNAE principal.
 * @property [dIniAtiv] - Data de Início de Atividades.
 * @property [dUltSit] - Data da última situação cadastral.
 * @property [dBaixa] - Data de Baixa.
 * @property [IEUnica] - Inscrição Estadual Única.
 * @property [IEAtual] - Inscrição Estadual Atual.
 * @property [Ender] - Endereço.
 */
export interface InfCad {
  IE: string;
  CNPJ?: string;
  CPF?: string;
  UF: string;
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
 * @property verAplic - Versão do aplicativo que processou a consulta.
 * @property cStat - `111->"uma-ocorrencia"`, `112->"multiplas-ocorrencias"`.
 * @property xMotivo - Descrição da resposta.
 * @property UF - Sigla da UF consultada.
 * @property [IE] - Inscrição Estadual.
 * @property [CNPJ] - CNPJ.
 * @property [CPF] - CPF.
 * @property dhCons - Data e hora da consulta.
 * @property cUF - Código da UF consultada.
 * @property infCad - Informações do cadastro.
 */
export interface NfeConsultaCadastroResponseRaw {
  infCons: {
    verAplic: string;
    cStat: string;
    xMotivo: string;
    UF: string;
    IE?: string;
    CNPJ?: string;
    CPF?: string;
    dhCons: string;
    cUF: string;
    infCad: InfCad[];
  };
}

export type NfeConsultaCadastroResponse = NfeWebServiceResponse<
  NfeConsultaCadastroStatus,
  NfeConsultaCadastroResponseRaw
>;
