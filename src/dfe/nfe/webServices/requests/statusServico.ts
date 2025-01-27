import type { UfCode } from "@/ufCode/types";
import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";
import type { NfeResultMsg } from "./common";

export interface NfeStatusServicoRequest {
  nfeDadosMsg: WithXmlns<{
    consStatServ: WithXmlnsVersao<{
      tpAmb: "1" | "2";
      cUF: UfCode;
      xServ: "STATUS";
    }>;
  }>;
}

/**
 * @description Resposta da consulta de status serviço.
 *
 * @property {"1"|"2"} tpAmb - Tipo de ambiente: 1-Produção 2-Homologação.
 * @property {string} verAplic - Versão do aplicativo que processou a consulta.
 * @property {string} cStat - Código do status da resposta.
 * @property {string} xMotivo - Descrição da resposta.
 * @property {UfCode} cUF - Código da UF que atendeu a solicitação.
 * @property {string} dhRecbto - Data e hora do processamento.
 * @property {string} [tMed] - Tempo médio de resposta do serviço (em segundos).
 * @property {string} [dhRetorno] - Data e hora previstas para o retorno do serviço.
 * @property {string} [xObs] - Informações adicionais para o contribuinte.
 */
export interface RetConsStatServ {
  tpAmb: "1" | "2";
  verAplic: string;
  cStat: LiteralStringUnion<"107" | "108" | "109" | "252" | "289">;
  xMotivo: string;
  cUF: UfCode;
  dhRecbto: string;
  tMed?: string;
  dhRetorno?: string;
  xObs?: string;
}

/**
 * @description Resposta completa da consulta de status serviço.
 *
 * @property {RetConsCad} nfeResultMsg.retConsStatServ - Informações da consulta.
 */
export type NfeStatusServicoResponse = NfeResultMsg<{
  retConsStatServ: RetConsStatServ;
}>;
