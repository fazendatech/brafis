import type { CertificateP12 } from "@/certificate";
import type { NfeLayout } from "@/dfe/nfe/layout";
import type { UF } from "@/ufCode/types";
import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";

import type { NfeWebServiceResponse } from "./common";

/**
 * @description Opções para configurar o web service de NFe autorização.
 *
 * @property {array} Nfe - Objeto com informações da NFe.
 */
export type NfeAutorizacaoOptions = {
  idLote: string;
  nfe: NfeLayout;
  certificate: CertificateP12;
};

export type NfeAutorizacaoRequest = WithXmlns<{
  enviNFe: WithXmlnsVersao<{
    idLote: string;
    // NOTE: Envio sincrono em lote está em desuso, por isso não é permito o campo ser `"1"`
    indSinc: "0";
    NFe: string;
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
}

export type NfeAutorizacaoStatus = "uso-autorizado" | "uso-denegado";

export type NfeAutorizacaoResponse = NfeWebServiceResponse<
  NfeAutorizacaoStatus,
  NfeAutorizacaoResponseRaw
>;