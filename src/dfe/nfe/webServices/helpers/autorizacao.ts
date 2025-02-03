import type { NfeLayoutWithSignature } from "@/dfe/nfe/layout";
import type { NfeAutorizacaoResponse } from "@/dfe/nfe/webServices/requests/autorizacao";
import { makeBuilder } from "@/utils/xml";

function buildNfeProc({
  xmlns,
  nfe,
  protNFe,
}: {
  xmlns: string;
  nfe: NfeLayoutWithSignature;
  protNFe: NfeAutorizacaoResponse["nfeResultMsg"]["retEnviNFe"]["protNFe"];
}): string | null {
  if (!protNFe) {
    return null;
  }

  return makeBuilder().build({
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
    nfeProc: {
      "@_xmlns": xmlns,
      "@_versao": "4.00",
      ...nfe,
      protNFe,
    },
  });
}

const helpersAutorizacao = { buildNfeProc };

// biome-ignore lint/style/noDefaultExport:
export default helpersAutorizacao;
