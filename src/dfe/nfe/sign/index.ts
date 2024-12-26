import { SignedXml } from "xml-crypto";

import type { CertificateP12 } from "@/certificate";

/**
 * @description Options for signing XML documents
 *
 * @property {CertificateP12} certificate - The digital certificate in PKCS#12 format used for signing
 * @property {string} xml - The XML document content to be signed
 * @property {string} [id] - Optional ID attribute value for the element to be signed
 * @property {string} [xpath] - Optional XPath expression to locate the element to be signed
 */
interface signXmlOptions {
  certificate: CertificateP12;
  xml: string;
  id?: string;
  xpath?: string;
}

/**
 * @description Gera o XML assinado.
 *
 * @param {NfeLayout} nfe - NFe a ser assinada.
 * @param {CertificateP12} certificate - O certificado usado na assinatura.
 *
 * @returns {string} O XML assinado.
 */
export function signXml({
  certificate,
  xml,
  xpath,
  id,
}: signXmlOptions): string {
  const { key, cert } = certificate.asPem();
  const sig = new SignedXml({
    privateKey: key,
    publicCert: cert,
    signatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
    canonicalizationAlgorithm:
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
  });

  sig.addReference({
    xpath: xpath ?? `//*[@Id='${id}']`,
    transforms: [
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
    ],
    digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
  });

  sig.computeSignature(xml);
  return sig.getSignedXml();
}
