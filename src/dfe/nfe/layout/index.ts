import { XMLBuilder } from "fast-xml-parser";
import { SignedXml } from "xml-crypto";
import { schemaNfeInfNfe, type NfeInfNfe } from "./groupA";

/**
 * @description Representa as informações necessárias para assinar uma NFe.
 */
export interface SignNfeInfo {
  privateKey: string;
  publicCert: string;
}

/**
 * @description Gera o XML assinado da NFe a partir do schema implementado com zod.
 */
export function signNfe(
  nfeData: NfeInfNfe,
  { privateKey, publicCert }: SignNfeInfo,
): string {
  schemaNfeInfNfe.parse(nfeData);

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const xml = builder.build({ NFe: nfeData });

  const sig = new SignedXml({
    privateKey,
    publicCert,
    signatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
    canonicalizationAlgorithm:
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
  });
  sig.addReference({
    xpath: "//*[local-name(.)='NFe']",
    transforms: [
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
    ],
    digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
  });

  sig.computeSignature(xml);
  return sig.getSignedXml();
}
