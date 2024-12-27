import type { UFCode } from "@/ufCode/types";
import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";

import type { NfeWebServiceResponse } from "./common";

/**
 * @description Opções para configurar o web service de NFe inutilização.
 *
 * @property {string} idLote - Identificador do lote.
 */
export type NfeInutilizacaoOptions = {
  cUF: UFCode;
  ano: string;
  cnpj: string;
  mod: "55" | "65";
  serie: string;
  nNfIni: string;
  nNfFin: string;
  xJust: string;
};

export type NfeInutilizacaoRequest = WithXmlns<{
  inutNFe: WithXmlnsVersao<{
    infInut: {
      "@_Id": string;
      tpAmb: "1" | "2";
      xServ: "INUTILIZAR";
      cUF: UFCode;
      ano: string;
      CNPJ: string;
      mod: string;
      serie: string;
      nNFIni: string;
      nNFFin: string;
      xJust: string;
    };
  }>;
}>;

/**
 * @description Informações da consulta.
 *
 * @property {string} Id - Identificador do lote.
 * @property {string} tpAmb - Tipo de ambiente.
 * @property {string} verAplic - Versão da aplicação.
 * @property {string} cStat - Código do status da resposta.
 * @property {string} xMotivo - Descrição do status da resposta.
 * @property {string} cUF - Código da UF.
 * @property {string} ano - Ano da inutilização.
 * @property {string} CNPJ - CNPJ do emitente.
 * @property {string} mod - Modelo da NFe.
 * @property {string} serie - Série da NFe.
 * @property {string} nNFIni - Número inicial da NFe.
 * @property {string} nNFFin - Número final da NFe.
 * @property {string} dhRecbto - Data e hora de recebimento.
 * @property {string} nProt - Número do protocolo.
 */
export interface NfeInutilizacaoResponseRaw {
  infInut: {
    "@_Id"?: string;
    tpAmb: "1" | "2";
    verAplic: string;
    cStat: string;
    xMotivo: string;
    cUF: string;
    ano?: string;
    CNPJ?: string;
    mod?: "55" | "65";
    serie?: string;
    nNFIni?: string;
    nNFFin?: string;
    dhRecbto: string;
    nProt?: string;
  };
}

export type NfeInutilizacaoStatus = "homologada";

export type NfeInutilizacaoResponse = NfeWebServiceResponse<
  NfeInutilizacaoStatus,
  NfeInutilizacaoResponseRaw
>;
