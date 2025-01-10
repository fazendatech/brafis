import { SignedXml } from "xml-crypto";

import type { CertificateP12 } from "@/certificate";
import { makeBuilder, makeParser } from "@/utils/xml";

/**
 * @description Opções para assinar objetos XML.
 *
 * @property {CertificateP12} certificate - O certificado digital no formato PKCS#12 usado para assinar
 * @property {unknown} xml - O conteúdo do documento XML a ser assinado
 * @property {string} signId - O ID do elemento a ser assinado
 */
export interface signXmlOptions {
  certificate: CertificateP12;
  xmlObject: unknown;
  signId: string;
}

/**
 * @description Retorna o objeto XML com assinatura.
 *
 * @param {signXmlOptions} - Opções para assinar objetos XML.
 *
 * @returns Objeto XML assinado.
 */
export function signXml({
  certificate,
  xmlObject,
  signId,
}: signXmlOptions): unknown {
  const xml = makeBuilder().build(xmlObject);

  const { key, cert } = certificate.asPem();
  const sig = new SignedXml({
    privateKey: key,
    publicCert: cert,
    signatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
    canonicalizationAlgorithm:
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
  });

  const xpath = `//*[@Id='${signId}']`;
  sig.addReference({
    xpath,
    transforms: [
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
    ],
    digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
  });

  sig.computeSignature(xml, {
    location: { action: "after", reference: xpath },
  });
  const signedXml = sig.getSignedXml();
  return makeParser().parse(signedXml);
}
