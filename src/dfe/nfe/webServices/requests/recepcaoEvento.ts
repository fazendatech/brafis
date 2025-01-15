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
type TpEvento =
  | "110111"
  | "110112"
  | "110110"
  | "210200"
  | "210210"
  | "210220"
  | "210240";

// NOTE: Todos os eventos estão na versão "1.00", caso um dia mude, será necessário refatorar o código.
type NfeRecepcaoEventoInfEventoBase<
  TpEventoKey extends TpEvento,
  DetEventoBase extends OptionsDetEvento,
  ExtraDetEvento = unknown,
> = {
  tpEvento: TpEventoKey;
  verEvento: "1.00";
  detEvento: { "@_versao": "1.00" } & DetEventoBase & ExtraDetEvento;
};

export type NfeRecepcaoEventoInfEvento =
  | NfeRecepcaoEventoInfEventoBase<"110111", OptionsCancelamento>
  | NfeRecepcaoEventoInfEventoBase<
      "110112",
      OptionsCancelamentoPorSubstituicao,
      {
        cOrgaoAutor: UFCode;
        tpAutor: "1";
      }
    >
  | NfeRecepcaoEventoInfEventoBase<
      "110110",
      OptionsCartaDeCorrecao,
      {
        xCondUso: "A Carta de Correção é disciplinada pelo § 1º-A do art. 7º do Convênio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularização de erro ocorrido na emissão de documento fiscal, desde que o erro não esteja relacionado com: I - as variáveis que determinam o valor do imposto tais como: base de cálculo, alíquota, diferença de preço, quantidade, valor da operação ou da prestação; II - a correção de dados cadastrais que implique mudança do remetente ou do destinatário; III - a data de emissão ou de saída.";
      }
    >
  | NfeRecepcaoEventoInfEventoBase<"210200", OptionsConfirmacaoDeOperacao>
  | NfeRecepcaoEventoInfEventoBase<"210210", OptionsCienciaDaOperacao>
  | NfeRecepcaoEventoInfEventoBase<"210220", OptionsDesconhecimentoDeOperacao>
  | NfeRecepcaoEventoInfEventoBase<"210240", OptionsOperacaoNaoRealizada>;

export type CpfOrCnpj =
  | { CPF: string; CNPJ?: never }
  | { CNPJ: string; CPF?: never };

type NfeRecepcaoEventoDetEventoBase<
  DescEventoKey extends DescEvento,
  Extra = unknown,
> = {
  descEvento: DescEventoKey;
} & Extra;

export type OptionsCancelamento = NfeRecepcaoEventoDetEventoBase<
  "Cancelamento",
  { nProt: string; xJust: string }
>;

export type OptionsCancelamentoPorSubstituicao = NfeRecepcaoEventoDetEventoBase<
  "Cancelamento por Substituição",
  { nProt: string; xJust: string; verAplic: string; chNFeRef: string }
>;

export type OptionsCartaDeCorrecao = NfeRecepcaoEventoDetEventoBase<
  "Carta de Correção",
  { xCorrecao: string }
>;

export type OptionsConfirmacaoDeOperacao =
  NfeRecepcaoEventoDetEventoBase<"Confirmação da Operação">;

export type OptionsCienciaDaOperacao =
  NfeRecepcaoEventoDetEventoBase<"Ciência da Operação">;

export type OptionsDesconhecimentoDeOperacao =
  NfeRecepcaoEventoDetEventoBase<"Desconhecimento da Operação">;

export type OptionsOperacaoNaoRealizada = NfeRecepcaoEventoDetEventoBase<
  "Operação não Realizada",
  { xJust: string }
>;

type OptionsDetEvento =
  | OptionsCancelamento
  | OptionsCancelamentoPorSubstituicao
  | OptionsCartaDeCorrecao
  | OptionsConfirmacaoDeOperacao
  | OptionsCienciaDaOperacao
  | OptionsDesconhecimentoDeOperacao
  | OptionsOperacaoNaoRealizada;

/**
 * @description Opções para configurar o web service de NFe Recepção Evento.
 */
export type NfeRecepcaoEventoOptions = {
  idLote: string;
  dhEvento: string;
  nSeqEvento: string;
  chNFe: string;
  detEvento: OptionsDetEvento;
} & CpfOrCnpj;

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
    evento: NfeRecepcaoEventoEventoWithSignature["evento"];
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

/**
 * @description Status do evento. cStat 128 = "lote-processado".
 */
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
    retEvento: {
      status: NfeRecepcaoEventoStatusEvento;
      description: string;
    } | null;
    xml: string | null;
  }
>;
