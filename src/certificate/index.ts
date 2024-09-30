import forge from "node-forge";
import {
  NoBagsFoundError,
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
   */
  constructor(options: CertificateP12Options) {
    this.pfxData = {
      bufferString: forge.util.binary.base64.encode(options.pfx),
      pass: options.passphrase,
    };
  }

  /**
   * @description Retrieves bags of a specified type from a PKCS#12 PFX file.
   * @private
   */
  private getBags(
    p12: forge.pkcs12.Pkcs12Pfx,
    bagType: string,
  ): forge.pkcs12.Bag[] {
    const bags = p12.getBags({ bagType })[bagType];
    if (!bags) {
      throw new NoBagsFoundError(forge.pki.oids[bagType]);
    }
    return bags;
  }

  /**
   * @description Retrieves the private key from a PKCS#12 PFX file.
   * @private
   */
  private getPrivateKey(p12: forge.pkcs12.Pkcs12Pfx): forge.pki.PrivateKey {
    const keyBags = this.getBags(p12, forge.pki.oids.pkcs8ShroudedKeyBag);
    const unencryptedKeyBags = this.getBags(p12, forge.pki.oids.keyBag);
    const [keyData] = keyBags.concat(unencryptedKeyBags);

    if (!keyData?.key) {
      //TODO: Criar classe de erro personalizada
      throw new NoPrivateKeyFoundError();
    }

    return keyData.key;
  }

  /**
   * @description Retrieves the certificate from a PKCS#12 PFX file.
   * @private
   */
  private getCertificate(p12: forge.pkcs12.Pkcs12Pfx): forge.pki.Certificate {
    const certBags = this.getBags(p12, forge.pki.oids.certBag);

    const [certBag] = certBags
      .filter((bag) => bag.cert)
      .sort(
        (a, b) =>
          (a.cert?.validity.notAfter.getTime() ?? 0) -
          (b.cert?.validity.notAfter.getTime() ?? 0),
      );

    if (!certBag?.cert) {
      throw new NoCertificatesFoundError();
    }

    return certBag.cert;
  }

  /**
   * @description Converte um arquivo PFX (PKCS#12) para o formato PEM.
   *
   * @returns {PemPayload} Um objeto contendo o certificado e a chave privada no formato PEM.
   *
   * @throws {Error} Se nenhum certificado ou chave privada for encontrado no arquivo PFX.
   */
  asPem(): PemPayload {
    const p12Der = forge.util.decode64(this.pfxData.bufferString);
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, true, this.pfxData.pass);

    const privateKey = this.getPrivateKey(p12);
    const certificate = this.getCertificate(p12);

    const rsaPrivateKey = forge.pki.privateKeyToAsn1(privateKey);
    const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);

    const cert = forge.pki.certificateToPem(certificate);
    const key = forge.pki.privateKeyInfoToPem(privateKeyInfo);

    return { cert, key };
  }

  /**
   * @description Extrai campos do certificado PEM.
   *
   * @returns {CertificateFields}
   */
  getPemFields(): CertificateP12Fields {
    const pem = this.asPem();
    const cert = forge.pki.certificateFromPem(pem.cert);

    function mapAttributes(
      attributes: forge.pki.CertificateField[],
    ): Record<string, string> {
      return attributes.reduce((acc: Record<string, string>, attr) => {
        if (attr.name && typeof attr.value === "string") {
          acc[attr.name] = attr.value;
        }
        return acc;
      }, {});
    }

    return {
      subject: mapAttributes(cert.subject.attributes),
      issuer: mapAttributes(cert.issuer.attributes),
      validFrom: cert.validity.notBefore,
      validTo: cert.validity.notAfter,
      serialNumber: cert.serialNumber,
      signatureAlgorithm: forge.pki.oids[cert.siginfo.algorithmOid],
    };
  }
}
