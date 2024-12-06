import { XMLBuilder } from "fast-xml-parser";
import { SignedXml } from "xml-crypto";
import { z } from "zod";

import { ufCodeMap } from "@/ufCode";
import type { UF, UFCode } from "@/ufCode/types";

import { schemaNfeInfNfe, type NfeInfNfe } from "./groupA";

// NOTE: Hack pro zod aceitar tipos customizados (https://stackoverflow.com/a/73825370)
const ufCodeList = Object.keys(ufCodeMap);
const ufCodes: [UFCode, ...UFCode[]] = [ufCodeList[0], ...ufCodeList];
export const zUfCode = () => z.enum(ufCodes);

const ufList = Object.values(ufCodeMap);
const ufs: [UF, ...UF[]] = [ufList[0], ...ufList];
export const zUf = () => z.enum(ufs);

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
export async function signNfe(
  nfeData: NfeInfNfe,
  { privateKey, publicCert }: SignNfeInfo,
): Promise<{ Nfe: string }> {
  const parsedObject = schemaNfeInfNfe.parse(nfeData);

  const builder = new XMLBuilder({ ignoreAttributes: false });
  const xml = builder.build({ NfeInfNfe: parsedObject });

  const sig = new SignedXml({
    privateKey,
    publicCert,
    signatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
    canonicalizationAlgorithm:
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
    getKeyInfoContent: () =>
      `<KeyInfo><X509Data><X509Certificate>${publicCert}</X509Certificate></X509Data></KeyInfo>`,
  });
  sig.addReference({
    uri: `#${nfeData["@_Id"]}`,
    transforms: [
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
    ],
    digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
  });

  sig.computeSignature(xml);
  return { Nfe: sig.getSignedXml() };
}
