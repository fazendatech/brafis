import type { UFCode } from "@/ufCode/types";
import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";

import type { NfeWebServiceResponse } from "./common";
import type { ProtNFe } from "./autorizacao";

/**
 * @description Opções para configurar o web service de NFe Consulta Protocolo.
 *
 * @property {string} chNFe - Identificador do lote.
 */
export interface NfeConsultaProtocoloOptions {
  chNFe: string;
}

export type NfeConsultaProtocoloRequest = WithXmlns<{
  consSitNFe: WithXmlnsVersao<{
    tpAmb: "1" | "2";
    xServ: "CONSULTAR";
    chNFe: string;
  }>;
}>;

/**
 * @description Resposta completa da consulta de status serviço.
 *
 * @property tpAmb - Tipo de ambiente: 1-Produção 2-Homologação.
 * @property verAplic - Versão do aplicativo que processou a consulta.
 * @property cStat - `"107"->"operando"`, `"108"->"paralisado-temporariamente"`, `"109"->"paralisado"`.
 * @property xMotivo - Descrição da resposta.
 * @property cUF - Código da UF que atendeu a solicitação.
 * @property dhRecbto - Data e hora do processamento.
 * @property [protNFe] - Protocolo de autorização ou denegação da NF-e.
 * • Informar se localizada uma NF-e com cStat = 100-
uso autorizado, 150-uso autorizado fora de prazo ou
110-uso denegado. (NT 2012.003)
  * @property [retCancNFe] - Informações de cancelamento da NF-e.
Informar se localizada uma
NF-e com cStat = 101-cancelado ou 151-
cancelado fora de prazo. (NT 2012.003)
  * @property [procEventoNFe] - Informação do evento e respectivo protocolo do evento.
 */
export interface NfeConsultaProtocoloResponseRaw {
  "@_versao": string;
  tpAmb: "1" | "2";
  verAplic: string;
  cStat: LiteralStringUnion<"100" | "101" | "110">;
  xMotivo: string;
  cUF: UFCode;
  dhRecbto: string;
  chNFe: string;
  protNFe?: ProtNFe;
  retCancNFe?: unknown;
  procEventoNFe?: { "@_versao": string; evento: unknown; retEvento: unknown }[];
}

export type NfeConsultaProtocoloStatus =
  | "uso-autorizado"
  | "cancelamento-de-nfe-homologado"
  | "uso-denegado";

export type NfeConsultaProtocoloResponse = NfeWebServiceResponse<
  NfeConsultaProtocoloStatus,
  NfeConsultaProtocoloResponseRaw
>;
