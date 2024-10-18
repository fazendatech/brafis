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

/**
 * @description Códigos de status da resposta do serviço.
 */
export type CodStats = LiteralStringUnion<
  "107" | "108" | "109" | "111" | "112"
>;

/**
 * @description Valores possíveis:
 * - Status Serviço ["operando", "paralisado-temporariamente", "paralisado"]
 * - Consulta Cadastro ["uma-ocorrencia", "multiplas-ocorrencias"]
 * - Sem Sucesso ["sem-sucesso"]
 */
export type InfoStats =
  | "sem-sucesso"
  // Status Serviço
  | "operando"
  | "paralisado-temporariamente"
  | "paralisado"
  // Consulta Cadastro
  | "uma-ocorrencia"
  | "multiplas-ocorrencias";

export type CStatsMap = { [cStat in CodStats]: InfoStats };

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

/**
 * @description Retorno do serviço de consulta de status serviço.
 *
 * @property {"operando" | "paralisado-temporariamente" | "paralisado" | "outro"} [status] - Status do serviço.
 * @property {string} [description] - Descrição do status (xMotivo).
 * @property {NfeStatusServicoRaw} [raw] (Opcional) - Resposta completa do serviço.
 */
export interface NfeStatusServicoResponse {
  status: InfoStats;
  description: string;
  raw?: NfeStatusServicoRaw;
}

/**
 * @description Resposta completa da consulta de status serviço.
 *
 * @property tpAmb - Tipo de ambiente: 1-Produção 2-Homologação.
 * @property verAplic - Versão do aplicativo que processou a consulta.
 * @property cStat - Código do status da resposta.
 * @property xMotivo - Descrição da resposta.
 * @property cUF - código da UF que atendeu a solicitação.
 * @property dhRecbto - Data e hora do processamento.
 * @property tMed - Tempo médio de resposta do serviço (em segundos).
 * @property dhRetorno - Data e hora previstas para o retorno do serviço.
 * @property xObs - Informações adicionais para o contribuinte.
 */
export interface NfeStatusServicoRaw {
  tpAmb?: "1" | "2";
  verAplic?: string;
  cStat?: CodStats;
  xMotivo?: string;
  cUF?: string;
  dhRecbto?: string;
  tMed?: string;
  dhRetorno?: string;
  xObs?: string;
}

/**
 * @description Opções para configurar o web service de consulta cadastro.
 *
 * @property {boolean} [raw] - Se verdadeiro, a resposta terá o parâmetro raw com a resposta completa do serviço.
 */
export interface NfeConsultaCadastroOptions {
  raw?: boolean;
  IE?: string;
  CNPJ?: string;
  CPF?: string;
}

/**
 * @description Retorno do serviço consulta cadastro.
 *
 * @property {NfeConsultaCadastroRaw} [raw] - Resposta completa do serviço, se passado o parâmetro raw.
 */
export interface NfeConsultaCadastroResponse {
  status: InfoStats;
  description: string;

  raw?: NfeConsultaCadastroRaw;
}

export interface NfeConsultaCadastroRaw {
  infCons?: {
    verAplic?: string;
    cStat?: CodStats;
    xMotivo?: string;
    UF?: string;
    IE?: string;
    CNPJ?: string;
    CPF?: string;
    dhCons?: string;
    cUF?: string;
    infCad?: {
      IE?: string;
      CNPJ?: string;
      CPF?: string;
      UF?: string;
      cSit?: string;
      indCredNFe?: string;
      indCredCTe?: string;
      xNome?: string;
      xFant?: string;
      xRegApur?: string;
      CNAE?: string;
      dIniAtiv?: string;
      dUltSit?: string;
      dBaixa?: string;
      IEUnica?: string;
      IEAtual?: string;
      Ender?: {
        xLgr?: string;
        Nro?: string;
        xCpl?: string;
        xBairro?: string;
        cMun?: string;
        xMun?: string;
        CEP?: string;
      };
    };
  };
}
