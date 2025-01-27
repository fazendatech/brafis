import type { UFCode } from "@/ufCode/types";
import type { WithXmlns, WithXmlnsVersao } from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";

import type { NfeWebServiceResponse } from "./common";

export type NfeStatusServicoRequest = WithXmlns<{
  consStatServ: WithXmlnsVersao<{
    tpAmb: "1" | "2";
    cUF: UFCode;
    xServ: "STATUS";
  }>;
}>;

/**
 * @description Resposta completa da consulta de status serviço.
 *
 * @property tpAmb - Tipo de ambiente: 1-Produção 2-Homologação.
 * @property verAplic - Versão do aplicativo que processou a consulta.
 * @property cStat - `"107"->"operando"`, `"108"->"paralisado-temporariamente"`, `"109"->"paralisado"`.
 * @property xMotivo - Descrição da resposta.
 * @property cUF - Código da UF que atendeu a solicitação.
 * @property dhRecbto - Data e hora do processamento.
 * @property [tMed] - Tempo médio de resposta do serviço (em segundos).
 * @property [dhRetorno] - Data e hora previstas para o retorno do serviço.
 * @property [xObs] - Informações adicionais para o contribuinte.
 */
export interface NfeStatusServicoResponseRaw {
  tpAmb: "1" | "2";
  verAplic: string;
  cStat: LiteralStringUnion<"107" | "108" | "109">;
  xMotivo: string;
  cUF: UFCode;
  dhRecbto: string;
  tMed?: string;
  dhRetorno?: string;
  xObs?: string;
}

export type NfeStatusServicoStatus =
  | "operando"
  | "paralisado-temporariamente"
  | "paralisado";

export type NfeStatusServicoResponse = NfeWebServiceResponse<
  NfeStatusServicoStatus,
  NfeStatusServicoResponseRaw
>;
