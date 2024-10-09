import type { LiteralStringUnion } from "@/utils/types";

export type Environment = "produção" | "homologação";

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
