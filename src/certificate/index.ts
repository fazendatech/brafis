import forge from "node-forge";

/**
 * Interface representing the extracted fields from a PEM certificate.
 */
interface CertificateFields {
  subject: { name: string; value: string }[];
  issuer: { name: string; value: string }[];
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  publicKey: string;
  signatureAlgorithm: string;
}

/**
 * Interface representing the PEM (Privacy-Enhanced Mail) format.
 * It is used to store both the certificate and the private key in PEM format.
 * PEM is a base64-encoded format commonly used for certificates and keys.
 */
interface PEM {
  cert: string;
  key: string;
}

/**
 * Interface representing the PFX (PKCS#12) format.
 * It holds the PFX data in a base64-encoded string (`bufferString`)
 * and the passphrase (`pass`) used to decrypt the private key.
 */
interface P12 {
  bufferString: string;
  pass: string;
}

/**
 * Interface representing a certificate bag used to store certificates.
 * This bag holds a `forge.pki.Certificate` object, which contains information
 * about the certificate, such as the subject, issuer, validity, and public key.
 */
interface CertBag {
  cert: forge.pki.Certificate;
}

/**
 * Class representing a Certificate that can convert PFX (PKCS#12) files to PEM format.
 * It provides methods to extract certificates and private keys from PFX files and
 * convert them into PEM format. PEM is often used for importing/exporting certificates
 * and keys in environments such as web servers or cloud services.
 */
export class Certificate {
  private readonly pfxData: P12;
  private pemData?: PEM;
  private certFields?: CertificateFields;

  /**
   * Getter to retrieve the Certificate fields.
   * If the Certificate fields are not yet populated, it triggers the extraction from the PEM certificate.
   *
   * @returns {CertificateFields} An object containing the certificate fields extracted from the PEM certificate.
   */
  public get pemFields(): CertificateFields {
    if (!this.certFields) {
      this.extractPemFields();
      if (!this.certFields) {
        throw new Error("Certificate fields are not available.");
      }
    }
    return this.certFields;
  }

  /**
   * Getter to retrieve the PEM data (certificate and private key).
   * If the PEM data is not yet populated, it triggers the conversion from PFX to PEM.
   *
   * @returns {PEM} An object containing the certificate and private key in PEM format.
   */
  get pem(): PEM {
    if (!this.pemData) {
      this.p12ToPem();
      if (!this.pemData) {
        throw new Error("PEM data is not available.");
      }
    }
    return this.pemData;
  }

  /**
   * Class constructor to initialize the Certificate instance with a PFX file and passphrase.
   * The PFX file is provided as an `ArrayBuffer`, and the passphrase is used to unlock
   * the private key contained in the PFX file.
   *
   * @param {ArrayBuffer} pfx - The buffer containing the PFX file data, typically from a file.
   * @param {string} passphrase - The passphrase used to decrypt the PFX file and extract the private key.
   */
  constructor(pfx: ArrayBuffer, passphrase: string) {
    const pfxUint8Array = new Uint8Array(pfx);
    this.pfxData = {
      bufferString: forge.util.binary.base64.encode(pfxUint8Array),
      pass: passphrase,
    };
  }

  /**
   * Converts a PFX (PKCS#12) file to PEM format.
   *
   * This method decodes the PFX data from base64 and extracts the private key and certificate(s).
   * It then sorts the certificates by expiration date, returning the certificate with the longest
   * validity and its corresponding private key in PEM format. If no certificates or private keys
   * are found in the PFX file, an error is thrown.
   *
   * @returns {PEM} An object containing the certificate and private key in PEM format.
   *
   * @throws {Error} If no certificates or private keys are found in the PFX file.
   *
   * @private
   */
  private p12ToPem(): PEM {
    // Decode the base64-encoded PFX data
    const p12Der = forge.util.decode64(this.pfxData.bufferString);
    // Convert the DER-encoded PFX data into an ASN.1 structure
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    // Parse the ASN.1 structure into a PKCS#12 object
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, true, this.pfxData.pass);

    const oids = forge.pki.oids;
    // Extract the encrypted and unencrypted private key data
    const keyBags = p12.getBags({
      bagType: oids.pkcs8ShroudedKeyBag,
    })[oids.pkcs8ShroudedKeyBag];
    const unencryptedKeyBags = p12.getBags({ bagType: oids.keyBag })[
      oids.keyBag
    ];
    const keyData = (keyBags || []).concat(unencryptedKeyBags || []);

    // Extract the certificates from the PFX and sort them by expiration date
    const certBags: CertBag[] = p12.getBags({
      bagType: oids.certBag,
    })[oids.certBag] as CertBag[];

    if (!certBags || certBags.length === 0) {
      throw new Error("No certificates found in the PFX file.");
    }

    // Sort certificates by expiration date (oldest first)
    certBags.sort((a: CertBag, b: CertBag) => {
      return (
        new Date(a.cert.validity.notAfter).getTime() -
        new Date(b.cert.validity.notAfter).getTime()
      );
    });

    // Throw an error if no private key is found
    if (!keyData[0]?.key) {
      throw new Error("No private key found in the PFX file.");
    }

    const pki = forge.pki;
    // Wrap the first private key into an RSA Private Key info structure
    const rsaPrivateKey = pki.privateKeyToAsn1(keyData[0].key);
    const privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey);

    // Convert the first certificate and private key to PEM format
    const cert = pki.certificateToPem(certBags[0].cert);
    const key = pki.privateKeyInfoToPem(privateKeyInfo);

    // Store the PEM data (certificate and private key)
    this.pemData = { cert, key };

    // Return the certificate and private key in PEM format
    return this.pemData;
  }

  /**
   * Extract fields from the PEM certificate.
   *
   * This method takes a PEM certificate and extracts important fields such as
   * subject, issuer, validity period, serial number, public key, and signature algorithm.
   *
   * @returns {CertificateFields} An object containing the extracted fields from the certificate.
   */
  private extractPemFields(): CertificateFields {
    const pki = forge.pki;
    const cert = pki.certificateFromPem(this.pem.cert);

    this.certFields = {
      subject: cert.subject.attributes.map((attr) => ({
        name: attr.name || "",
        value: typeof attr.value === "string" ? attr.value : "",
      })),
      issuer: cert.issuer.attributes.map((attr) => ({
        name: attr.name || "",
        value: typeof attr.value === "string" ? attr.value : "",
      })),
      validFrom: cert.validity.notBefore,
      validTo: cert.validity.notAfter,
      serialNumber: cert.serialNumber,
      publicKey: forge.util.decodeUtf8(pki.publicKeyToPem(cert.publicKey)),
      signatureAlgorithm: cert.siginfo.algorithmOid,
    };

    return this.certFields;
  }
}
