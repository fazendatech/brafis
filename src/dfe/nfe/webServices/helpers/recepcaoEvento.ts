import type {
  CpfOrCnpj,
  DescEvento,
  NfeRecepcaoEventoEvento,
  NfeRecepcaoEventoEventoWithSignature,
  NfeRecepcaoEventoResponse,
  OptionsDetEvento,
  TpEvento,
} from "@/dfe/nfe/webServices/requests/recepcaoEvento";
import { makeBuilder } from "@/utils/xml";

function buildEvento({
  xmlns,
  cUf,
  tpAmb,
  detEvento,
  cpfOrCnpj,
  chNFe,
  dhEvento,
  nSeqEvento,
}: {
  xmlns: string;
  cUf: string;
  tpAmb: "1" | "2";
  detEvento: OptionsDetEvento;
  cpfOrCnpj: CpfOrCnpj;
  chNFe: string;
  dhEvento: string;
  nSeqEvento: string;
}): NfeRecepcaoEventoEvento {
  const { descEvento } = detEvento;

  const tpEventoMap: Record<DescEvento, TpEvento> = {
    Cancelamento: "110111",
    "Cancelamento por Substituição": "110112",
    "Carta de Correção": "110110",
    "Confirmação da Operação": "210200",
    "Ciência da Operação": "210210",
    "Desconhecimento da Operação": "210220",
    "Operação não Realizada": "210240",
  };
  const tpEvento = tpEventoMap[descEvento];
  // NOTE: Definido na seção 5.8.1 do Manual de Orientação do Contribuinte Versão 7.00
  const id = `ID${tpEvento}${chNFe}${nSeqEvento.padStart(2, "0")}`;

  if (descEvento === "Cancelamento") {
    return {
      evento: {
        "@_xmlns": xmlns,
        "@_versao": "1.00",
        infEvento: {
          "@_Id": id,
          cOrgao: cUf,
          tpAmb: tpAmb,
          ...cpfOrCnpj,
          chNFe,
          dhEvento,
          tpEvento: "110111",
          nSeqEvento,
          verEvento: "1.00",
          detEvento: {
            "@_versao": "1.00",
            descEvento,
            nProt: detEvento.nProt,
            xJust: detEvento.xJust,
          },
        },
      },
    };
  }
  if (descEvento === "Cancelamento por Substituição") {
    return {
      evento: {
        "@_xmlns": xmlns,
        "@_versao": "1.00",
        infEvento: {
          "@_Id": id,
          cOrgao: cUf,
          tpAmb: tpAmb,
          ...cpfOrCnpj,
          chNFe,
          dhEvento,
          tpEvento: "110112",
          nSeqEvento,
          verEvento: "1.00",
          detEvento: {
            "@_versao": "1.00",
            descEvento,
            cOrgaoAutor: cUf,
            tpAutor: "1",
            verAplic: detEvento.verAplic,
            nProt: detEvento.nProt,
            xJust: detEvento.xJust,
            chNFeRef: detEvento.chNFeRef,
          },
        },
      },
    };
  }
  if (descEvento === "Carta de Correção") {
    return {
      evento: {
        "@_xmlns": xmlns,
        "@_versao": "1.00",
        infEvento: {
          "@_Id": id,
          cOrgao: cUf,
          tpAmb: tpAmb,
          ...cpfOrCnpj,
          chNFe,
          dhEvento,
          tpEvento: "110110",
          nSeqEvento,
          verEvento: "1.00",
          detEvento: {
            "@_versao": "1.00",
            descEvento,
            xCorrecao: detEvento.xCorrecao,
            xCondUso:
              "A Carta de Correção é disciplinada pelo § 1º-A do art. 7º do Convênio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularização de erro ocorrido na emissão de documento fiscal, desde que o erro não esteja relacionado com: I - as variáveis que determinam o valor do imposto tais como: base de cálculo, alíquota, diferença de preço, quantidade, valor da operação ou da prestação; II - a correção de dados cadastrais que implique mudança do remetente ou do destinatário; III - a data de emissão ou de saída.",
          },
        },
      },
    };
  }
  if (descEvento === "Confirmação da Operação") {
    return {
      evento: {
        "@_xmlns": xmlns,
        "@_versao": "1.00",
        infEvento: {
          "@_Id": id,
          cOrgao: cUf,
          tpAmb: tpAmb,
          ...cpfOrCnpj,
          chNFe,
          dhEvento,
          tpEvento: "210200",
          nSeqEvento,
          verEvento: "1.00",
          detEvento: {
            "@_versao": "1.00",
            descEvento,
          },
        },
      },
    };
  }
  if (descEvento === "Ciência da Operação") {
    return {
      evento: {
        "@_xmlns": xmlns,
        "@_versao": "1.00",
        infEvento: {
          "@_Id": id,
          cOrgao: cUf,
          tpAmb: tpAmb,
          ...cpfOrCnpj,
          chNFe,
          dhEvento,
          tpEvento: "210210",
          nSeqEvento,
          verEvento: "1.00",
          detEvento: {
            "@_versao": "1.00",
            descEvento,
          },
        },
      },
    };
  }
  if (descEvento === "Desconhecimento da Operação") {
    return {
      evento: {
        "@_xmlns": xmlns,
        "@_versao": "1.00",
        infEvento: {
          "@_Id": id,
          cOrgao: cUf,
          tpAmb: tpAmb,
          ...cpfOrCnpj,
          chNFe,
          dhEvento,
          tpEvento: "210220",
          nSeqEvento,
          verEvento: "1.00",
          detEvento: {
            "@_versao": "1.00",
            descEvento,
          },
        },
      },
    };
  }
  if (descEvento === "Operação não Realizada") {
    return {
      evento: {
        "@_xmlns": xmlns,
        "@_versao": "1.00",
        infEvento: {
          "@_Id": id,
          cOrgao: cUf,
          tpAmb: tpAmb,
          ...cpfOrCnpj,
          chNFe,
          dhEvento,
          tpEvento: "210240",
          nSeqEvento,
          verEvento: "1.00",
          detEvento: {
            "@_versao": "1.00",
            descEvento,
            xJust: detEvento.xJust,
          },
        },
      },
    };
  }
  throw new Error(`Evento não suportado: ${descEvento}`);
}

function buildProcEventoNfe({
  xmlns,
  evento,
  retEvento,
}: {
  xmlns: string;
  evento: NfeRecepcaoEventoEventoWithSignature;
  retEvento: NfeRecepcaoEventoResponse["nfeResultMsg"]["retEnvEvento"]["retEvento"];
}): string | null {
  if (!retEvento) {
    return null;
  }

  const { "@_xmlns": _, ...eventoWithoutXmlns } = evento.evento;
  return makeBuilder().build({
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
    procEventoNFe: {
      "@_xmlns": xmlns,
      "@_versao": "1.00",
      evento: eventoWithoutXmlns,
      retEvento,
    },
  });
}

const helpersRecepcaoEvento = { buildEvento, buildProcEventoNfe };

// biome-ignore lint/style/noDefaultExport:
export default helpersRecepcaoEvento;
