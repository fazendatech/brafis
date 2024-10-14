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

export type ConsultaCadastroOptions = {
  IE?: string;
  CNPJ?: string;
  CPF?: string;
};
