import type { NfeLayout, NfeLayoutWithSignature } from "@/dfe/nfe/layout";
import type { UF } from "@/ufCode/types";
import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";

import type { NfeWebServiceResponse } from "./common";

/**
 * @description Opções para configurar o web service de NFe autorização.
 *
 * @property {string} idLote - Identificador do lote.
 * @property {NfeLayout} nfe - Objeto com informações da NFe.
 */
export type NfeAutorizacaoOptions = {
  idLote: string;
  nfe: NfeLayout;
};

export type NfeAutorizacaoRequest = WithXmlns<{
  enviNFe: WithXmlnsVersao<{
    idLote: string;
    // NOTE: Envio assíncrono em lote se tornará obsoleto para NF-e. Estamos tratando apenas o caso síncrono (indSinc=1).
    indSinc: "1";
    NFe: NfeLayoutWithSignature["NFe"];
  }>;
}>;

/**
 * @description Informações da consulta.
 *
 * @property tpAmb - Tipo de ambiente: 1-Produção 2-Homologação.
 * @property verAplic - Versão do aplicativo que processou a consulta.
 * @property cStat - .
 * @property xMotivo - Descrição da resposta.
 * @property cUF - Código da UF consultada.
 * @property dhRecbto - Data e hora da consulta.
 * @property [infRec] - Dados do recibo do lote.
 * @property infRec.nRec - Número do Recibo gerado.
 * @property infRec.tMed - Tempo médio de resposta do serviço (em segundos) dos últimos 5 minutos.
 */
export interface NfeAutorizacaoResponseRaw {
  tpAmb: string;
  verAplic: string;
  cStat: LiteralStringUnion<"100">;
  xMotivo: string;
  cUF: UF;
  dhRecbto: string;
  infRec?: { nRec: string; tMed: string };
  protNFe?: {
    "@_versao": string;
    infProt: {
      "@_Id"?: string;
      tpAmb: string;
      verAplic: string;
      chNFe: string;
      dhRecbto: string;
      nProt?: string;
      digVal?: string;
      cStat: string;
      xMotivo: string;
    };
  };
}

export type NfeAutorizacaoStatus =
  | "lote-recebido"
  | "lote-processado"
  | "lote-em-processamento"
  | "lote-nao-localizado";

/**
 * @description Status do protocolo. cStat 100 = "uso-autorizado". Qualquer outro valor é considerado erro.
 */
export type NfeAutorizacaoStatusProtocolo = "uso-autorizado" | "erro";

export type NfeAutorizacaoResponse = NfeWebServiceResponse<
  NfeAutorizacaoStatus,
  NfeAutorizacaoResponseRaw
> & {
  protocolo: {
    status: NfeAutorizacaoStatusProtocolo;
    description: string;
  } | null;
  xml: string | null;
};
