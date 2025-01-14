import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";

import type { NfeWebServiceResponse } from "./common";
import type { UFCode } from "@/ufCode/types";

/**
 * @description Mapeamento de eventos `descEvento` para `tpEvento`
 */
export const eventoTp = {
  Cancelamento: "110111",
  "Cancelamento por Substituicao": "110112",
  "Carta de Correcao": "110110",
  "Confirmacao da Operacao": "210200",
  "Ciencia da Operacao": "210210",
  "Desconhecimento da Operacao": "210220",
  "Operacao nao Realizada": "210240",
};

/**
 * @description Tipos de eventos disponíveis.
 */
export type descEvento = keyof typeof eventoTp;

// NOTE: Todos os eventos estão na versão "1.00", caso um dia mude, será necessário refatorar o código.
type NfeRecepcaoEventoBase<
  DescEvento extends descEvento = descEvento,
  EventoExtras = unknown,
> = {
  tpEvento: (typeof eventoTp)[DescEvento];
  verEvento: "1.00";
  detEvento: {
    "@_versao": "1.00";
    descEvento: descEvento;
  } & EventoExtras;
};

type NfeRecepcaoEventoDetEvento =
  | NfeRecepcaoEventoBase<"Cancelamento", { nProt: string; xJust: string }>
  | NfeRecepcaoEventoBase<
      "Cancelamento por Substituicao",
      {
        cOrgaoAutor: UFCode;
        tpAutor: "1";
        verAplic: string;
        nProt: string;
        xJust: string;
        chNFeRef: string;
      }
    >
  | NfeRecepcaoEventoBase<
      "Carta de Correcao",
      {
        xCorrecao: string;
        xCondUso: "A Carta de Correcao e disciplinada pelo paragrafo 1o-A do art. 7o do Convenio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularizacao de erro ocorrido na emissao de documento fiscal, desde que o erro nao esteja relacionado com: I - as variaveis que determinam o valor do imposto tais como: base de calculo, aliquota, diferenca de preco, quantidade, valor da operacao ou da prestacao; II - a correcao de dados cadastrais que implique mudanca do remetente ou do destinatario; III - a data de emissao ou de saida.";
      }
    >
  | NfeRecepcaoEventoBase<"Confirmacao da Operacao">
  | NfeRecepcaoEventoBase<"Ciencia da Operacao">
  | NfeRecepcaoEventoBase<"Desconhecimento da Operacao">
  | NfeRecepcaoEventoBase<"Operacao nao Realizada", { xJust: string }>;

type CpfOrCnpj = { CPF: string; CNPJ?: never } | { CNPJ: string; CPF?: never };

type NfeRecepcaoEventoOptionsBase<
  DescEvento extends descEvento = descEvento,
  EventoExtras = unknown,
> = {
  descEvento: DescEvento;
} & EventoExtras;

type NfeRecepcaoEventoOptionsDescEvento =
  | NfeRecepcaoEventoOptionsBase<
      "Cancelamento",
      { nProt: string; xJust: string }
    >
  | NfeRecepcaoEventoOptionsBase<
      "Cancelamento por Substituicao",
      { nProt: string; xJust: string }
    >
  | NfeRecepcaoEventoOptionsBase<"Carta de Correcao", { xCorrecao: string }>
  | NfeRecepcaoEventoOptionsBase<"Confirmacao da Operacao">
  | NfeRecepcaoEventoOptionsBase<"Ciencia da Operacao">
  | NfeRecepcaoEventoOptionsBase<"Desconhecimento da Operacao">
  | NfeRecepcaoEventoOptionsBase<"Operacao nao Realizada", { xJust: string }>;

/**
 * @description Opções para configurar o web service de NFe Recepção Evento.
 */
export type NfeRecepcaoEventoOptions = {
  idLote: string;
  eventos: (CpfOrCnpj & {
    chaveNfe: string;
  } & NfeRecepcaoEventoOptionsDescEvento)[];
};

type Evento = {
  "@_versao": "1.00";
  infEvento: {
    "@_Id": string;
    cOrgao: string;
    tpAmb: "1" | "2";
    chNFe: string;
    dhEvento: string;
    nSeqEvento:
      | "1"
      | "2"
      | "3"
      | "4"
      | "5"
      | "6"
      | "7"
      | "8"
      | "9"
      | "10"
      | "11"
      | "12"
      | "13"
      | "14"
      | "15"
      | "16"
      | "17"
      | "18"
      | "19"
      | "20";
  } & CpfOrCnpj &
    NfeRecepcaoEventoDetEvento;
};

export type EventoWithSignature = Evento & {
  Signature: unknown;
};

export type NfeRecepcaoEventoRequest = WithXmlns<{
  envEvento: WithXmlnsVersao<{
    idLote: string;
    evento: EventoWithSignature[];
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
