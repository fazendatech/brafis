import { makeBuilder } from "@/utils/xml";
import type { NfeLayoutWithSignature } from "../../layout";
import type { NfeAutorizacaoResponseRaw } from "../requests/autorizacao";

function buildNfeProc({
  xmlns,
  nfe,
  retEnviNFe,
}: {
  xmlns: string;
  nfe: NfeLayoutWithSignature;
  retEnviNFe: NfeAutorizacaoResponseRaw;
}): string | null {
  const cStatProtocolo = retEnviNFe.protNFe?.infProt.cStat;
  if (!cStatProtocolo) {
    return null;
  }

  return makeBuilder().build({
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8" },
    nfeProc: {
      "@_xmlns": xmlns,
      "@_versao": "4.00",
      ...nfe,
      protNFe: retEnviNFe.protNFe,
    },
  });
}

const helpersAutorizacao = { buildNfeProc };

// biome-ignore lint/style/noDefaultExport:
export default helpersAutorizacao;
