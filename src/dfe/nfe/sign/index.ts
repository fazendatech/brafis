import { SignedXml } from "xml-crypto";

import type { CertificateP12 } from "@/certificate";
/**
 * @description Opções para assinar documentos XML
 *
 * @property {CertificateP12} certificate - O certificado digital no formato PKCS#12 usado para assinar
 * @property {string} xml - O conteúdo do documento XML a ser assinado
 * @property {string} signId - O ID do elemento a ser assinado
 */
interface signXmlOptions {
  certificate: CertificateP12;
  xml: string;
  signId: string;
}

/**
 * @description Gera o XML assinado.
 *
 * @param {NfeLayout} nfe - NFe a ser assinada.
 * @param {CertificateP12} certificate - O certificado usado na assinatura.
 *
 * @returns {string} O XML assinado.
 */
export function signXml({ certificate, xml, signId }: signXmlOptions): string {
  const { key, cert } = certificate.asPem();
  const sig = new SignedXml({
    privateKey: key,
    publicCert: cert,
    signatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
    canonicalizationAlgorithm:
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
  });

  sig.addReference({
    xpath: `//*[@Id='${signId}']`,
    transforms: [
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
      "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
    ],
    digestAlgorithm: "http://www.w3.org/2000/09/xmldsig#sha1",
  });

  sig.computeSignature(xml);
  return sig.getSignedXml();
}
