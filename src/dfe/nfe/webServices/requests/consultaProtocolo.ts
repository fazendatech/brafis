import type {
  NfeRecepcaoEventoEventoWithSignature,
  NfeRecepcaoEventoRetEvento,
} from "@/dfe/nfe/webServices/requests/recepcaoEvento";
import type { UfCode } from "@/ufCode/types";
import type {
  WithVersao,
  WithXmlns,
  WithXmlnsVersao,
} from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";
import type { NfeAutorizacaoProtNfe } from "./autorizacao";
import type { NfeResultMsg } from "./common";

/**
 * @description Opções para configurar o web service de NFe Consulta Protocolo.
 *
 * @property {string} chNFe - Chave da NF-e consultada.
 */
export interface NfeConsultaProtocoloOptions {
  chNFe: string;
}

export type NfeConsultaProtocoloRequest = {
  nfeDadosMsg: WithXmlns<{
    consSitNFe: WithXmlnsVersao<{
      tpAmb: "1" | "2";
      xServ: "CONSULTAR";
      chNFe: string;
    }>;
  }>;
};

type ProcEventoNfe = {
  evento: NfeRecepcaoEventoEventoWithSignature;
  retEvento: NfeRecepcaoEventoRetEvento;
};

/**
 * @description Resposta completa da consulta de status serviço.
 *
 * @property {"1" | "2"}nfeResultMsg.retConsSitNFe.tpAmb - Tipo de ambiente: 1-Produção 2-Homologação.
 * @property {string} nfeResultMsg.retConsSitNFe.verAplic - Versão do aplicativo que processou a consulta.
 * @property {string} nfeResultMsg.retConsSitNFe.cStat - `"100"->"uso-autorizado"`, `"101"->"cancelamento-de-nfe-homologado"`, `"110"->"uso-denegado"`.
 * @property {string} nfeResultMsg.retConsSitNFe.xMotivo - Descrição da resposta.
 * @property {UfCode} nfeResultMsg.retConsSitNFe.cUF - Código da UF que atendeu a solicitação.
 * @property {string} nfeResultMsg.retConsSitNFe.dhRecbto - Data e hora do processamento.
 * @property {string} nfeResultMsg.retConsSitNFe.chNFe - Chave de acesso da NF-e.
 * @property {NfeAutorizacaoProtNfe} [nfeResultMsg.retConsSitNFe.protNFe] - Protocolo de autorização ou denegação da NF-e.
 * @property {ProcEventoNfe[]} [nfeResultMsg.retConsSitNFe.procEventoNFe] - Informações do evento e respectivo protocolo do evento.
 */
export type NfeConsultaProtocoloResponse = NfeResultMsg<{
  retConsSitNFe: WithVersao<{
    tpAmb: "1" | "2";
    verAplic: string;
    cStat: LiteralStringUnion<
      | "100"
      | "101"
      | "110"
      | "217"
      | "226"
      | "236"
      | "252"
      | "526"
      | "561"
      | "562"
      | "613"
      | "614"
      | "615"
      | "616"
      | "617"
      | "618"
      | "619"
    >;
    xMotivo: string;
    cUF: UfCode;
    dhRecbto: string;
    chNFe: string;
    protNFe?: NfeAutorizacaoProtNfe;
    procEventoNFe?: ProcEventoNfe[];
  }>;
}>;
