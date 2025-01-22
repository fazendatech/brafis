import type {
  WithVersao,
  WithXmlns,
  WithXmlnsVersao,
} from "@/utils/soap/types";
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

// NOTE: Todos os eventos estão na versão "1.00", caso um dia mude, será necessário refatorar o código.
// NOTE: DetEventoBase é o tipo base para os detalhes do evento passados como parâmetro para o método, enquanto ExtraDetEvento é um tipo que contêm demais parâmetros que fazem parte da requisição mas é construído dentro do metodo do webservice.
type NfeRecepcaoEventoInfEventoBase<
  TpEventoKey extends TpEvento,
  DetEventoBase extends OptionsDetEvento,
  ExtraDetEvento = unknown,
> = {
  tpEvento: TpEventoKey;
  verEvento: "1.00";
  detEvento: WithVersao<DetEventoBase & ExtraDetEvento>;
};

type NfeRecepcaoEventoInfEvento =
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
  | NfeRecepcaoEventoInfEventoBase<"210200", OptionsConfirmacaoDaOperacao>
  | NfeRecepcaoEventoInfEventoBase<"210210", OptionsCienciaDaOperacao>
  | NfeRecepcaoEventoInfEventoBase<"210220", OptionsDesconhecimentoDaOperacao>
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

type OptionsCancelamento = NfeRecepcaoEventoDetEventoBase<
  "Cancelamento",
  { nProt: string; xJust: string }
>;

type OptionsCancelamentoPorSubstituicao = NfeRecepcaoEventoDetEventoBase<
  "Cancelamento por Substituição",
  { nProt: string; xJust: string; verAplic: string; chNFeRef: string }
>;

type OptionsCartaDeCorrecao = NfeRecepcaoEventoDetEventoBase<
  "Carta de Correção",
  { xCorrecao: string }
>;

type OptionsConfirmacaoDaOperacao =
  NfeRecepcaoEventoDetEventoBase<"Confirmação da Operação">;

type OptionsCienciaDaOperacao =
  NfeRecepcaoEventoDetEventoBase<"Ciência da Operação">;

type OptionsDesconhecimentoDaOperacao =
  NfeRecepcaoEventoDetEventoBase<"Desconhecimento da Operação">;

type OptionsOperacaoNaoRealizada = NfeRecepcaoEventoDetEventoBase<
  "Operação não Realizada",
  { xJust: string }
>;

export type OptionsDetEvento =
  | OptionsCancelamento
  | OptionsCancelamentoPorSubstituicao
  | OptionsCartaDeCorrecao
  | OptionsConfirmacaoDaOperacao
  | OptionsCienciaDaOperacao
  | OptionsDesconhecimentoDaOperacao
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
  evento: WithXmlnsVersao<{
    infEvento: {
      "@_Id": string;
      cOrgao: string;
      tpAmb: "1" | "2";
      chNFe: string;
      dhEvento: string;
      nSeqEvento: string;
    } & CpfOrCnpj &
      NfeRecepcaoEventoInfEvento;
  }>;
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
 * @description Retorno do evento.
 *
 * @property {string} @_versao - Versão do evento.
 * @property {object} infEvento - Informações do evento.
 * @property {string} infEvento.@_Id - Identificador do evento.
 * @property {string} infEvento.tpAmb - Tipo de ambiente.
 * @property {string} infEvento.verAplic - Versão da aplicação.
 * @property {string} infEvento.cOrgao - Código do órgão.
 * @property {string} infEvento.cStat - Código do status da resposta.
 * @property {string} infEvento.xMotivo - Descrição do status da resposta.
 * @property {string} infEvento.chNFe - Chave da NFe.
 * @property {string} infEvento.tpEvento - Tipo do evento.
 * @property {string} infEvento.xEvento - Descrição do evento.
 * @property {string} infEvento.nSeqEvento - Sequência do evento.
 * @property {string} infEvento.cOrgaoAutor - Código do órgão autor.
 * @property {string} infEvento.CNPJDest - CNPJ do destinatário.
 * @property {string} infEvento.CPFDest - CPF do destinatário.
 * @property {string} infEvento.emailDest - E-mail do destinatário.
 * @property {string} infEvento.dhRegEvento - Data e hora do registro do evento.
 * @property {string} infEvento.nProt - Número do protocolo.
 * @property {string} infEvento.chNFePend - Chave da NFe pendente.
 */
export type NfeRecepcaoEventoRetEvento = WithVersao<{
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
 */
export interface NfeRecepcaoEventoResponseRaw {
  idLote: string;
  tpAmb: string;
  verAplic: string;
  cOrgao: string;
  cStat: LiteralStringUnion<"128">;
  xMotivo: string;
  retEvento?: NfeRecepcaoEventoRetEvento;
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
