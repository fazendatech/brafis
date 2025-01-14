import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";

import type { NfeWebServiceResponse } from "./common";
import type { UFCode } from "@/ufCode/types";

export type DescEvento =
  | "Cancelamento"
  | "Cancelamento por Substituição"
  | "Carta de Correção"
  | "Confirmação da Operação"
  | "Ciência da Operação"
  | "Desconhecimento da Operação"
  | "Operação não Realizada";
export type TpEvento =
  | "110111"
  | "110112"
  | "110110"
  | "210200"
  | "210210"
  | "210220"
  | "210240";

/**
 * @description Mapeamento de eventos `descEvento` para `tpEvento`
 */
export const DESC_EVENTO_MAP: Record<DescEvento, TpEvento> = {
  Cancelamento: "110111",
  "Cancelamento por Substituição": "110112",
  "Carta de Correção": "110110",
  "Confirmação da Operação": "210200",
  "Ciência da Operação": "210210",
  "Desconhecimento da Operação": "210220",
  "Operação não Realizada": "210240",
};

// NOTE: Todos os eventos estão na versão "1.00", caso um dia mude, será necessário refatorar o código.
type NfeRecepcaoEventoInfEventoBase<
  DescEventoKey extends DescEvento,
  DetEventoBase extends NfeRecepcaoEventoOptionsDetEvento,
  ExtraDetEvento = unknown,
> = {
  tpEvento: (typeof DESC_EVENTO_MAP)[DescEventoKey];
  verEvento: "1.00";
  detEvento: DetEventoBase & { "@_versao": "1.00" } & ExtraDetEvento;
};

export type NfeRecepcaoEventoInfEvento =
  | NfeRecepcaoEventoInfEventoBase<
      "Cancelamento",
      NfeRecepcaoEventoDetEventoOptionsCancelamento
    >
  | NfeRecepcaoEventoInfEventoBase<
      "Cancelamento por Substituição",
      NfeRecepcaoEventoDetEventoOptionsCancelamentoPorSubstituicao,
      {
        cOrgaoAutor: UFCode;
        tpAutor: "1";
        verAplic: string;
        chNFeRef: string;
      }
    >
  | NfeRecepcaoEventoInfEventoBase<
      "Carta de Correção",
      NfeRecepcaoEventoDetEventoOptionsCartaDeCorrecao,
      {
        xCondUso: "A Carta de Correção é disciplinada pelo § 1º-A do art. 7º do Convênio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularização de erro ocorrido na emissão de documento fiscal, desde que o erro não esteja relacionado com: I - as variáveis que determinam o valor do imposto tais como: base de cálculo, alíquota, diferença de preço, quantidade, valor da operação ou da prestação; II - a correção de dados cadastrais que implique mudança do remetente ou do destinatário; III - a data de emissão ou de saída.";
      }
    >
  | NfeRecepcaoEventoInfEventoBase<
      "Confirmação da Operação",
      NfeRecepcaoEventoDetEventoOptionsConfirmacaoDeOperacao
    >
  | NfeRecepcaoEventoInfEventoBase<
      "Ciência da Operação",
      NfeRecepcaoEventoDetEventoOptionsCienciaDaOperacao
    >
  | NfeRecepcaoEventoInfEventoBase<
      "Desconhecimento da Operação",
      NfeRecepcaoEventoDetEventoOptionsDesconhecimentoDeOperacao
    >
  | NfeRecepcaoEventoInfEventoBase<
      "Operação não Realizada",
      NfeRecepcaoEventoDetEventoOptionsOperacaoNaoRealizada
    >;

type CpfOrCnpj = { CPF: string; CNPJ?: never } | { CNPJ: string; CPF?: never };

type NfeRecepcaoEventoDetEventoBase<
  DescEventoKey extends DescEvento,
  Extra = unknown,
> = {
  descEvento: DescEventoKey;
} & Extra;

type NfeRecepcaoEventoDetEventoOptionsCancelamento =
  NfeRecepcaoEventoDetEventoBase<
    "Cancelamento",
    { nProt: string; xJust: string }
  >;

type NfeRecepcaoEventoDetEventoOptionsCancelamentoPorSubstituicao =
  NfeRecepcaoEventoDetEventoBase<
    "Cancelamento por Substituição",
    { nProt: string; xJust: string }
  >;

type NfeRecepcaoEventoDetEventoOptionsCartaDeCorrecao =
  NfeRecepcaoEventoDetEventoBase<"Carta de Correção", { xCorrecao: string }>;

type NfeRecepcaoEventoDetEventoOptionsConfirmacaoDeOperacao =
  NfeRecepcaoEventoDetEventoBase<"Confirmação da Operação">;

type NfeRecepcaoEventoDetEventoOptionsCienciaDaOperacao =
  NfeRecepcaoEventoDetEventoBase<"Ciência da Operação">;

type NfeRecepcaoEventoDetEventoOptionsDesconhecimentoDeOperacao =
  NfeRecepcaoEventoDetEventoBase<"Desconhecimento da Operação">;

type NfeRecepcaoEventoDetEventoOptionsOperacaoNaoRealizada =
  NfeRecepcaoEventoDetEventoBase<"Operação não Realizada", { xJust: string }>;

type NfeRecepcaoEventoOptionsDetEvento =
  | NfeRecepcaoEventoDetEventoOptionsCancelamento
  | NfeRecepcaoEventoDetEventoOptionsCancelamentoPorSubstituicao
  | NfeRecepcaoEventoDetEventoOptionsCartaDeCorrecao
  | NfeRecepcaoEventoDetEventoOptionsConfirmacaoDeOperacao
  | NfeRecepcaoEventoDetEventoOptionsCienciaDaOperacao
  | NfeRecepcaoEventoDetEventoOptionsDesconhecimentoDeOperacao
  | NfeRecepcaoEventoDetEventoOptionsOperacaoNaoRealizada;

/**
 * @description Opções para configurar o web service de NFe Recepção Evento.
 */
export type NfeRecepcaoEventoOptions = {
  idLote: string;
  autor: CpfOrCnpj;
  nSeqEvento: string;
  chaveNfe: string;
  evento: NfeRecepcaoEventoOptionsDetEvento;
};

export type NfeRecepcaoEventoEvento = {
  evento: {
    "@_versao": "1.00";
    infEvento: {
      "@_Id": string;
      cOrgao: string;
      tpAmb: "1" | "2";
      chNFe: string;
      dhEvento: string;
      nSeqEvento: string;
    } & CpfOrCnpj &
      NfeRecepcaoEventoInfEvento;
  };
};

export type NfeRecepcaoEventoEventoWithSignature = {
  evento: NfeRecepcaoEventoEvento["evento"] & {
    Signature: unknown;
  };
};

export type NfeRecepcaoEventoRequest = WithXmlns<{
  envEvento: WithXmlnsVersao<{
    idLote: string;
    evento: NfeRecepcaoEventoEventoWithSignature["evento"][];
  }>;
}>;

/**
 * @description Informações da consulta.
 *
 * @property {string} idLote - Identificador do lote.
 * @property {string} tpAmb - Tipo de ambiente.
 * @property {string} verAplic - Versão da aplicação.
 * @property {string} cOrgao - Código do órgão.
 * @property {string} cStat - Código do status da resposta.
 * @property {string} xMotivo - Descrição do status da resposta.
 * @property {object} retEvento - Informações do evento.
 * @property {string} retEvento.@_versao - Versão do evento.
 * @property {object} retEvento.infEvento - Informações do evento.
 * @property {string} retEvento.infEvento.@_Id - Identificador do evento.
 * @property {string} retEvento.infEvento.tpAmb - Tipo de ambiente.
 * @property {string} retEvento.infEvento.verAplic - Versão da aplicação.
 * @property {string} retEvento.infEvento.cOrgao - Código do órgão.
 * @property {string} retEvento.infEvento.cStat - Código do status da resposta.
 * @property {string} retEvento.infEvento.xMotivo - Descrição do status da resposta.
 * @property {string} retEvento.infEvento.chNFe - Chave da NFe.
 * @property {string} retEvento.infEvento.tpEvento - Tipo do evento.
 * @property {string} retEvento.infEvento.xEvento - Descrição do evento.
 * @property {string} retEvento.infEvento.nSeqEvento - Sequência do evento.
 * @property {string} retEvento.infEvento.cOrgaoAutor - Código do órgão autor.
 * @property {string} retEvento.infEvento.CNPJDest - CNPJ do destinatário.
 * @property {string} retEvento.infEvento.CPFDest - CPF do destinatário.
 * @property {string} retEvento.infEvento.emailDest - E-mail do destinatário.
 * @property {string} retEvento.infEvento.dhRegEvento - Data e hora do registro do evento.
 * @property {string} retEvento.infEvento.nProt - Número do protocolo.
 * @property {string} retEvento.infEvento.chNFePend - Chave da NFe pendente.
 */
export interface NfeRecepcaoEventoResponseRaw {
  idLote: string;
  tpAmb: string;
  verAplic: string;
  cOrgao: string;
  cStat: LiteralStringUnion<"128">;
  xMotivo: string;
  retEvento?: {
    "@_versao": string;
    infEvento: {
      "@_Id"?: string;
      tpAmb: string;
      verAplic: string;
      cOrgao: string;
      cStat: LiteralStringUnion<"135" | "136">;
      xMotivo: string;
      chNFe?: string;
      tpEvento?: string;
      xEvento?: string;
      nSeqEvento?: string;
      cOrgaoAutor?: string;
      CNPJDest?: string;
      CPFDest?: string;
      emailDest?: string;
      dhRegEvento: string;
      nProt?: string;
      chNFePend?: string;
    };
    Signature?: unknown;
  };
}

export type NfeRecepcaoEventoStatus = "lote-processado";

/**
 * @description Status do evento. cStat 135 = "evento-registrado-vinculado-a-nfe" ou "136" = "evento-registrado-nao-vinculado-a-nfe". Qualquer outro valor é considerado erro.
 */
export type NfeRecepcaoEventoStatusEvento =
  | "evento-registrado-vinculado-a-nfe"
  | "evento-registrado-nao-vinculado-a-nfe"
  | "erro";

export type NfeRecepcaoEventoResponse = NfeWebServiceResponse<
  NfeRecepcaoEventoStatus,
  NfeRecepcaoEventoResponseRaw,
  {
    evento: {
      status: NfeRecepcaoEventoStatusEvento;
      description: string;
    } | null;
    xml: string | null;
  }
>;
