import forge from "node-forge";

interface PEM {
  cert: string;
  key: string;
}

interface PFX {
  p12Buffer: string;
  pass: string;
}

interface CertBag {
  cert: forge.pki.Certificate;
}

export class Certificate {
  private readonly pfxData: PFX;
  private pemData: PEM = { cert: "", key: "" };

  get pem(): PEM {
    if (this.pemData.cert === "" && this.pemData.key === "") {
      this.p12ToPem();
    }
    return this.pemData;
  }

  /**
   * Class constructor to initialize the Certificado instance.
   * @param {Buffer} pfx - The buffer containing the PFX file data
   * @param {string} passphrase - The passphrase to unlock the private key
   */
  constructor(pfx: Buffer, passphrase: string) {
    this.pfxData = { p12Buffer: pfx.toString("base64"), pass: passphrase };
  }

  /**
   * Converts a PFX (PKCS#12) file to PEM format.
   *
   * This method decodes the PFX data from base64, extracts the private key and certificate,
   * and converts them to PEM format. The certificate data is sorted by expiration date,
   * and the first certificate and private key are returned in PEM format.
   *
   * @returns {PEM} An object containing the certificate and private key in PEM format.
   *
   * @throws {Error} If no certificates or private keys are found in the PFX file.
   */
  private p12ToPem(): PEM {
    // Decode the p12 from base64
    const p12Der = forge.util.decode64(this.pfxData.p12Buffer);
    // Decode the base64 string into ASN.1 structure
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, true, this.pfxData.pass);

    // Extract private key data (both encrypted and unencrypted)
    const keyBags = p12.getBags({
      bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
    })[forge.pki.oids.pkcs8ShroudedKeyBag];
    const unencryptedKeyBags = p12.getBags({ bagType: forge.pki.oids.keyBag })[
      forge.pki.oids.keyBag
    ];
    const keyData = (keyBags || []).concat(unencryptedKeyBags || []);

    // Extract the certificate data and sort by expiration date
    const certBags: CertBag[] = p12.getBags({
      bagType: forge.pki.oids.certBag,
    })[forge.pki.oids.certBag] as CertBag[];

    if (!certBags) {
      throw new Error("No certificates found in the PFX file.");
    }

    certBags.sort((a: CertBag, b: CertBag) => {
      return (
        new Date(a.cert.validity.notAfter).getTime() -
        new Date(b.cert.validity.notAfter).getTime()
      );
    });

    if (certBags.length === 0) {
      throw new Error("No certificates found in the PFX file.");
    }

    // Get the first key and wrap it into RSA Private Key info
    if (!keyData[0]?.key) {
      throw new Error("No private key found in the PFX file.");
    }
    const rsaPrivateKey = forge.pki.privateKeyToAsn1(keyData[0].key);
    const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);

    // Convert the first certificate and private key to PEM format
    const cert = forge.pki.certificateToPem(certBags[0].cert);
    const key = forge.pki.privateKeyInfoToPem(privateKeyInfo);

    this.pemData = { cert, key };
    // Return the certificate and key in PEM format
    return this.pemData;
  }
}
