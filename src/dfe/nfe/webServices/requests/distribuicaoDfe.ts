import type { UfCode } from "@/ufCode/types";
import type {
  WithVersao,
  WithXmlns,
  WithXmlnsVersao,
} from "@/utils/soap/types";
import type { LiteralStringUnion } from "@/utils/types";
import type { CpfOrCnpj } from "./recepcaoEvento";

export type NfeDistribuicaoDfeOperation =
  | {
      distNSU: { ultNSU: string };
      consNSU?: never;
      consChNFe?: never;
    }
  | {
      distNSU?: never;
      consNSU: { NSU: string };
      consChNFe?: never;
    }
  | {
      distNSU?: never;
      consNSU?: never;
      consChNFe: { chNFe: string };
    };

/**
 * @description Opções para configurar o web service de NFeDistribuiçãoDFe.
 *
 * @property CPF | CNPJ - CPF ou CNPJ do interessado no DF-e.
 * @property distNSU | consNSU | consChNFe - Operação a ser realizada.
 * @property distNSU.ultNSU - Último NSU recebido pelo autor
 * @property consNSU.NSU - NSU a ser consultado.
 * @property consChNFe.chNFe - Chave da NFe a ser consultada.
 */
export type NfeDistribuicaoDfeOptions = CpfOrCnpj & NfeDistribuicaoDfeOperation;

export type NfeDistribuicaoDfeRequest = {
  nfeDistDFeInteresse: WithXmlns<{
    nfeDadosMsg: {
      distDFeInt: WithXmlnsVersao<
        {
          tpAmb: "1" | "2";
          cUFAutor: UfCode;
        } & CpfOrCnpj &
          NfeDistribuicaoDfeOperation
      >;
    };
  }>;
};

/**
 * @description Resposta completa da distribuição DFe.
 *
 * @property tpAmb - Tipo de ambiente: 1-Produção 2-Homologação.
 * @property verAplic - Versão do aplicativo que processou a consulta.
 * @property cStat - `"137"->"nenhum-documento-localizado"`, `"138"->"documento-localizado"`.
 * @property xMotivo - Descrição da resposta.
 * @property dhResp - Data e hora da resposta.
 * @property [ultNSU] - Último NSU processado.
 * @property [maxNSU] - Maior NSU encontrado.
 * @property [loteDistDFeInt] - Lote de distribuição de DF-e.
 * @property loteDistDFeInt.docZip - Array de documentos zipados.
 * @property loteDistDFeInt["@_NSU"] - NSU do lote.
 * @property loteDistDFeInt["@_schema"] - Schema do lote.
 */
export type NfeDistribuicaoDfeResponse = {
  nfeDistDFeInteresseResponse: {
    nfeDistDFeInteresseResult: {
      retDistDFeInt: WithVersao<{
        tpAmb: "1" | "2";
        verAplic: string;
        cStat: LiteralStringUnion<"137" | "138">;
        xMotivo: string;
        dhResp: string;
        ultNSU?: string;
        maxNSU?: string;
        loteDistDFeInt?: {
          docZip: string[];
          "@_NSU": string;
          "@_schema": string;
        };
      }>;
    };
  };
};
