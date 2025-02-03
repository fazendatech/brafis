import type { NfeLayout } from "@/dfe/nfe/layout";
import type { Uf } from "@/ufCode/types";
import type {
  WithVersao,
  WithXmlns,
  WithXmlnsVersao,
} from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";
import type { NfeResultMsg } from "./common";

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

export interface NfeAutorizacaoRequest {
  nfeDadosMsg: WithXmlns<{
    enviNFe: WithXmlnsVersao<{
      idLote: string;
      // NOTE: Envio assíncrono em lote se tornará obsoleto para NF-e. Estamos tratando apenas o caso síncrono (indSinc=1).
      indSinc: "1";
      NFe: NfeLayout["NFe"];
    }>;
  }>;
}

export type NfeAutorizacaoProtNfe = WithVersao<{
  infProt: {
    "@_Id"?: string;
    tpAmb: string;
    verAplic: string;
    chNFe: string;
    dhRecbto: string;
    nProt?: string;
    digVal?: string;
    cStat: LiteralStringUnion<"100">;
    xMotivo: string;
  };
}>;

/**
 * @description Informações da consulta.
 *
 * @property tpAmb - Tipo de ambiente: 1-Produção 2-Homologação.
 * @property verAplic - Versão do aplicativo que processou a consulta.
 * @property cStat - Código do status da resposta.
 * @property xMotivo - Descrição da resposta.
 * @property cUF - Código da UF consultada.
 * @property dhRecbto - Data e hora da consulta.
 * @property [infRec] - Dados do recibo do lote.
 * @property infRec.nRec - Número do Recibo gerado.
 * @property infRec.tMed - Tempo médio de resposta do serviço (em segundos) dos últimos 5 minutos.
 */
export type NfeAutorizacaoResponse = NfeResultMsg<{
  retEnviNFe: {
    tpAmb: string;
    verAplic: string;
    cStat: LiteralStringUnion<"103" | "104" | "105" | "106">;
    xMotivo: string;
    cUF: Uf;
    dhRecbto: string;
    infRec?: { nRec: string; tMed: string };
    protNFe?: NfeAutorizacaoProtNfe;
  };
}> & {
  xml: string | null;
};
