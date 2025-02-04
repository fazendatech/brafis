import type { UfCode } from "@/ufCode/types";
import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";
import type { NfeResultMsg } from "./common";

/**
 * @description Opções para configurar o web service de NFe inutilização.
 *
 * @property {string} ano - Ano de inutilização da numeração.
 * @property {string} CNPJ - CNPJ do emitente.
 * @property {string} mod - Modelo da NFe: "55" ou "65".
 * @property {string} serie - Série da NFe.
 * @property {string} nNFIni - Número inicial da NFe a ser inutilizada.
 * @property {string} nNFFin - Número final da NFe a ser inutilizada.
 * @property {string} xJust - Justificativa da inutilização.
 */
export interface NfeInutilizacaoOptions {
  ano: string;
  CNPJ: string;
  mod: "55" | "65";
  serie: string;
  nNFIni: string;
  nNFFin: string;
  xJust: string;
}

export interface NfeInutilizacaoInutNfe {
  inutNFe: WithXmlnsVersao<{
    infInut: {
      "@_Id": string;
      tpAmb: "1" | "2";
      xServ: "INUTILIZAR";
      cUF: UfCode;
      ano: string;
      CNPJ: string;
      mod: string;
      serie: string;
      nNFIni: string;
      nNFFin: string;
      xJust: string;
    };
  }>;
}

export type NfeInutilizacaoRequest = {
  nfeDadosMsg: WithXmlns<NfeInutilizacaoInutNfe>;
};

export type NfeInutilizacaoInutNfeWithSignature = {
  inutNFe: NfeInutilizacaoInutNfe["inutNFe"] & { Signature: unknown };
};

/**
 * @description Informações da consulta.
 *
 * @property {string} infInut.Id - Identificador do lote.
 * @property {string} infInut.tpAmb - Tipo de ambiente.
 * @property {string} infInut.verAplic - Versão da aplicação.
 * @property {string} infInut.cStat - Código do status da resposta.
 * @property {string} infInut.xMotivo - Descrição do status da resposta.
 * @property {string} infInut.cUF - Código da UF.
 * @property {string} infInut.ano - Ano da inutilização.
 * @property {string} infInut.CNPJ - CNPJ do emitente.
 * @property {string} infInut.mod - Modelo da NFe.
 * @property {string} infInut.serie - Série da NFe.
 * @property {string} infInut.nNFIni - Número inicial da NFe.
 * @property {string} infInut.nNFFin - Número final da NFe.
 * @property {string} infInut.dhRecbto - Data e hora de recebimento.
 * @property {string} infInut.nProt - Número do protocolo.
 */
interface RetInutNfe {
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

/**
 * @description Resposta completa da inutilização.
 *
 * @property {RetInutNfe} nfeResultMsg.retInutNFe - retorno da inutilização.
 */
export type NfeInutilizacaoResponse = NfeResultMsg<{
  retInutNFe: RetInutNfe;
}>;
