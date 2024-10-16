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

export type UrlWebServices = {
  [env in Environment]: {
    [server in AuthServer]: {
      [service in WebService]?: string;
    };
  };
};

export type GetWebServiceUrlOptions = {
  uf?: UF;
  service: WebService;
  env: Environment;
  contingency?: boolean;
};

/**
 * Opções para configurar o serviço de status.
 *
 * @property {boolean} [raw] - Se verdadeiro, retorna a resposta completa do serviço.
 * @property {number} [timeout] - Especifica a duração do timeout em milissegundos.
 */
export type StatusServicoOptions = {
  raw?: boolean;
  timeout?: number;
};

/**
 * @description Retorno do serviço de consulta de status
 *
 * @property cStat - Código do status da resposta.
 * @property xMotivo - Descrição da resposta.
 * @property cUF - código da UF que atendeu a solicitação
 * @property dhRetorno - Data e hora previstas para o retorno do serviço.
 * @property xObs - Informações adicionais para o contribuinte.
 */
export type Status = {
  cStat?: string;
  xMotivo?: string;
  cUF?: string;
  dhRetorno?: string;
  xObs?: string;
};

/**
 * @description Retorno do serviço de consulta de status
 *
 * @property tpAmb - Tipo de ambiente: 1-Produção 2-Homologação
 * @property verAplic - Versão do aplicativo que processou a consulta.
 * @property cStat - Código do status da resposta.
 * @property xMotivo - Descrição da resposta.
 * @property cUF - código da UF que atendeu a solicitação
 * @property dhRecbto - Data e hora do processamento.
 * @property tMed - Tempo médio de resposta do serviço (em segundos).
 * @property dhRetorno - Data e hora previstas para o retorno do serviço.
 * @property xObs - Informações adicionais para o contribuinte.
 */
export type StatusRaw = {
  tpAmb?: string;
  verAplic?: string;
  cStat?: string;
  xMotivo?: string;
  cUF?: string;
  dhRecbto?: string;
  tMed?: string;
  dhRetorno?: string;
  xObs?: string;
};

export type StatusServicoResponse = {
  nfeResultMsg: {
    retConsStatServ: StatusRaw;
  };
};

export type ConsultaCadastroOptions = {
  raw?: boolean;
  timeout?: number;
  uf?: UF;
  IE?: string;
  CNPJ?: string;
  CPF?: string;
};

export type ConsultaCad = {
  infCons: {
    verAplic?: string;
    cStat?: string;
    xMotivo?: string;
    UF?: string;
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
};

export type ConsultaCadRaw = {
  infCons: {
    verAplic?: string;
    cStat?: number;
    xMotivo?: string;
    UF?: string;
    IE?: string;
    CNPJ?: number;
    CPF?: number;
    dhCons?: string;
    cUF?: number;
    infCad?: {
      IE?: string;
      CNPJ?: number;
      CPF?: number;
      UF?: string;
      cSit?: number;
      indCredNFe?: number;
      indCredCTe?: number;
      xNome?: string;
      xFant?: string;
      xRegApur?: string;
      CNAE?: number;
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
        cMun?: number;
        xMun?: string;
        CEP?: number;
      };
    };
  };
};

export type ConsultaCadastroResponse = {
  nfeResultMsg: {
    retConsCad: ConsultaCadRaw;
  };
};
