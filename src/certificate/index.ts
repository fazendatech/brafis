import forge from "node-forge";
import {
  InvalidPfxError,
  InvalidPassphraseError,
  NoPrivateKeyFoundError,
  NoCertificatesFoundError,
} from "./errors.ts";
import type {
  CertificateP12Options,
  P12Payload,
  PemPayload,
  CertificateP12Fields,
} from "./index.d";

/**
 * @description Representa um Certificado PFX (PKCS#12).
 */
export class CertificateP12 {
  private readonly pfxData: P12Payload;

  /**
   * @param {CertificateP12Options} options
   *
   * @throws {InvalidPfxError, InvalidPassphraseError}
   */
  constructor(options: CertificateP12Options) {
    if (!(options.pfx instanceof Uint8Array) || options.pfx.length === 0) {
      throw new InvalidPfxError();
    }
    if (
      typeof options.passphrase !== "string" ||
      options.passphrase.length === 0
    ) {
      throw new InvalidPassphraseError();
    }

    this.pfxData = {
      bufferString: forge.util.binary.base64.encode(options.pfx),
      pass: options.passphrase,
    };
  }

  /**
   * @description Recupera o conteúdo bags de um tipo especifico de um arquivo PKCS#12 PFX.
   */
  private getBags(
    p12: forge.pkcs12.Pkcs12Pfx,
    bagType: string,
  ): forge.pkcs12.Bag[] {
    return p12.getBags({ bagType })[bagType] || [];
  }

  /**
   * @description Recupera a chave privada de um arquivo PKCS#12 PFX.
   */
  private getPrivateKey(
    p12: forge.pkcs12.Pkcs12Pfx,
  ): forge.pki.PrivateKey | null {
    const keyBags = this.getBags(p12, forge.pki.oids.pkcs8ShroudedKeyBag);
    const unencryptedKeyBags = this.getBags(p12, forge.pki.oids.keyBag);
    const [keyData] = keyBags.concat(unencryptedKeyBags);

    return keyData?.key ?? null;
  }

  /**
   * @description Recupera o certificado de um arquivo PKCS#12 PFX.
   */
  private getCertificate(
    p12: forge.pkcs12.Pkcs12Pfx,
  ): forge.pki.Certificate | null {
    const certBags = this.getBags(p12, forge.pki.oids.certBag);

    const [certBag] = certBags
      .filter((bag) => bag.cert)
      .sort(
        (a, b) =>
          (a.cert?.validity.notAfter.getTime() ?? 0) -
          (b.cert?.validity.notAfter.getTime() ?? 0),
      );

    return certBag?.cert ?? null;
  }

  /**
   * @description Converte um arquivo PFX (PKCS#12) para o formato PEM.
   *
   * @returns {PemPayload} Um objeto contendo o certificado e a chave privada no formato PEM.
   *
   * @throws {NoPrivateKeyFoundError, NoCertificatesFoundError}
   */
  asPem(): PemPayload {
    const p12Der = forge.util.decode64(this.pfxData.bufferString);
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, true, this.pfxData.pass);

    const privateKey = this.getPrivateKey(p12);
    if (!privateKey) {
      throw new NoPrivateKeyFoundError();
    }

    const certificate = this.getCertificate(p12);
    if (!certificate) {
      throw new NoCertificatesFoundError();
    }

    const rsaPrivateKey = forge.pki.privateKeyToAsn1(privateKey);
    const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);

    const cert = forge.pki.certificateToPem(certificate);
    const key = forge.pki.privateKeyInfoToPem(privateKeyInfo);

    return { cert, key };
  }

  /**
   * @description Mapeia os atributos do issuer e subject de um certificado
   */
  private mapCertificateFieldAttributes(
    attributes: forge.pki.CertificateField[],
  ): Record<string, string> {
    const mappedAttributes: Record<string, string> = {};
    for (const attr of attributes) {
      if (attr.name && typeof attr.value === "string") {
        mappedAttributes[attr.name] = attr.value;
      }
    }
    return mappedAttributes;
  }

  /**
   * @description Extrai campos do certificado PEM.
   *
   * @returns {CertificateFields}
   */
  getPemFields(): CertificateP12Fields {
    const pem = this.asPem();
    const cert = forge.pki.certificateFromPem(pem.cert);

    return {
      subject: this.mapCertificateFieldAttributes(cert.subject.attributes),
      issuer: this.mapCertificateFieldAttributes(cert.issuer.attributes),
      validFrom: cert.validity.notBefore,
      validTo: cert.validity.notAfter,
      serialNumber: cert.serialNumber,
      signatureAlgorithm: forge.pki.oids[cert.siginfo.algorithmOid],
    };
  }
}
