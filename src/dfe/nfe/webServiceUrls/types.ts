import type { UF } from "@/ufCode/types";

/**
 * @description Ambiente de emissão da NF-e (tpAmb).
 * producao -> tpAmb = 1
 * homologacao -> tpAmb = 2
 */
export type Environment = "producao" | "homologacao";

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

export type NfeWebService =
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
      [service in NfeWebService]?: string;
    };
  };
};

export interface GetWebServiceUrlOptions {
  uf: UF;
  service: NfeWebService;
  env: Environment;
  contingency?: boolean;
}
