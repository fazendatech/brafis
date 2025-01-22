import { makeBuilder } from "@/utils/xml";
import type { NfeLayoutWithSignature } from "../../layout";
import type { NfeAutorizacaoResponseRaw } from "../requests/autorizacao";

function buildNfeProc({
  xmlns,
  nfe,
  protNFe,
}: {
  xmlns: string;
  nfe: NfeLayoutWithSignature;
  protNFe: NfeAutorizacaoResponseRaw["protNFe"];
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
