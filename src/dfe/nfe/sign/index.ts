import { XMLBuilder } from "fast-xml-parser";
import { SignedXml } from "xml-crypto";
import { parseNfe, type NfeLayout } from "../layout";
import type { CertificateP12 } from "@/certificate";

/**
 * @description Gera o XML assinado da NFe.
 *
 * @param {NfeLayout} nfe - NFe a ser assinada.
 * @param {CertificateP12} certificate - O certificado usado na assinatura.
 *
 * @returns {string} O XML assinado da NFe.
 */
export function signNfe(nfe: NfeLayout, certificate: CertificateP12): string {
  parseNfe(nfe);

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const xml = builder.build(nfe);

  const { key, cert } = certificate.asPem();
  const sig = new SignedXml({
    privateKey: key,
    publicCert: cert,
    signatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
    canonicalizationAlgorithm:
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
  });
  sig.addReference({
    xpath: `//*[@Id='${nfe.NFe.infNFe["@_Id"]}']`,
    transforms: [
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
    ],
    digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
  });

  sig.computeSignature(xml);
  return sig.getSignedXml();
}
