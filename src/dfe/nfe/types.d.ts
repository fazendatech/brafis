import type { LiteralStringUnion } from "@/utils/types";

/**
 * @description Ambiente de emissão da NF-e (tpAmb).
 * producao -> tpAmb = 1
 * homologacao -> tpAmb = 2
 */
export type Environment = "producao" | "homologacao";

export type UF = LiteralStringUnion<
  | "AC"
  | "AL"
  | "AP"
  | "AM"
  | "BA"
  | "CE"
  | "DF"
  | "ES"
  | "GO"
  | "MA"
  | "MT"
  | "MS"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RN"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO"
>;

/**
 * @description Código numérico de uma UF
 */
export type UFCode = LiteralStringUnion<
  | "12"
  | "27"
  | "16"
  | "13"
  | "29"
  | "23"
  | "53"
  | "32"
  | "52"
  | "21"
  | "51"
  | "50"
  | "31"
  | "15"
  | "25"
  | "41"
  | "26"
  | "22"
  | "33"
  | "24"
  | "43"
  | "11"
  | "14"
  | "42"
  | "35"
  | "28"
  | "17"
>;

/**
 * @description Servidores de autorização da NF-e
 */
export type AuthServer =
  | "AM"
  | "BA"
  | "GO"
  | "MG"
  | "MS"
  | "MT"
  | "PE"
  | "PR"
  | "RS"
  | "SP"
  | "SVAN"
  | "SVRS"
  | "SVCAN"
  | "SVCRS"
  | "AN";

export type WebService =
  | "NfeInutilizacao"
  | "NfeConsultaProtocolo"
  | "NfeStatusServico"
  | "NfeConsultaCadastro"
  | "RecepcaoEvento"
  | "NFeAutorizacao"
  | "NFeRetAutorizacao"
  | "NFeDistribuicaoDFe";

export type WebServiceUrls = {
  [env in Environment]: {
    [server in AuthServer]: {
      [service in WebService]?: string;
    };
  };
};

export interface GetWebServiceUrlOptions {
  uf: UF;
  service: WebService;
  env: Environment;
  contingency?: boolean;
}

export interface NfeRequestOptions<Body> {
  body: Body;
  timeout: number;
}

type WithXmlns<T = unknown> = { "@_xmlns": string } & T;
type WithVersao<T = unknown> = { "@_versao": string } & T;
type WithXmlnsVersao<T = unknown> = WithXmlns<WithVersao<T>>;

export type NfeWebServiceResponse<Status, Raw> = {
  status: Status | "outro";
  description: string;
  raw: Raw;
};

export type NfeStatusServicoRequest = WithXmlns<{
  consStatServ: WithXmlnsVersao<{
    tpAmb: "1" | "2";
    cUF: UFCode;
    xServ: "STATUS";
  }>;
}>;

export type NfeStatusServicoStatus =
  | "operando"
  | "paralisado-temporariamente"
  | "paralisado";

/**
 * @description Resposta completa da consulta de status serviço.
 *
 * @property tpAmb - Tipo de ambiente: 1-Produção 2-Homologação.
 * @property verAplic - Versão do aplicativo que processou a consulta.
 * @property cStat - `107->"operando"`, `108->"paralisado-temporariamente"`, `109->"paralisado"`.
 * @property xMotivo - Descrição da resposta.
 * @property cUF - Código da UF que atendeu a solicitação.
 * @property dhRecbto - Data e hora do processamento.
 * @property [tMed] - Tempo médio de resposta do serviço (em segundos).
 * @property [dhRetorno] - Data e hora previstas para o retorno do serviço.
 * @property [xObs] - Informações adicionais para o contribuinte.
 */
export interface NfeStatusServicoResponseRaw {
  tpAmb: "1" | "2";
  verAplic: string;
  cStat: string;
  xMotivo: string;
  cUF: string;
  dhRecbto: string;
  tMed?: string;
  dhRetorno?: string;
  xObs?: string;
}

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
 * @property CNPJ - CNPJ.
 * @property CPF - CPF.
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
  CNPJ: string;
  CPF: string;
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
 * @property IE - Inscrição Estadual.
 * @property CNPJ - CNPJ.
 * @property CPF - CPF.
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
    IE: string;
    CNPJ: string;
    CPF: string;
    dhCons: string;
    cUF: string;
    infCad: InfCad[];
  };
}
