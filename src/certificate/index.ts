import forge from "node-forge";

/**
 * @description Options for configuring a certificate.
 *
 * @property {ArrayBuffer} pfx - The PFX (Personal Information Exchange) data for the certificate.
 * @property {string} passphrase - The passphrase to decrypt the PFX data.
 */
export interface CertificateOptions {
  pfx: ArrayBuffer;
  passphrase: string;
}

/**
 * @description Interface que representa o formato PEM (Privacy-Enhanced Mail).
 * É usada para armazenar tanto o certificado quanto a chave privada no formato PEM.
 * PEM é um formato codificado em base64 comumente usado para certificados e chaves.
 */
export interface PemPayload {
  cert: string;
  key: string;
}

/**
 * @description Interface que representa o formato PFX (PKCS#12).
 * Ela contém os dados do PFX em uma string codificada em base64 (`bufferString`)
 * e a senha (`pass`) usada para descriptografar a chave privada.
 */
export interface P12Payload {
  bufferString: string;
  pass: string;
}

/**
 * @description Represents the fields of a certificate.

 * @property {Array<{ name: string; value: string }>} subject - The subject of the certificate, represented as an array of name-value pairs.
 * @property {Array<{ name: string; value: string }>} issuer - The issuer of the certificate, represented as an array of name-value pairs.
 * @property {Date} validFrom - The date from which the certificate is valid.
 * @property {Date} validTo - The date until which the certificate is valid.
 * @property {string} serialNumber - The serial number of the certificate.
 * @property {string} publicKey - The public key associated with the certificate.
 * @property {string} signatureAlgorithm - The algorithm used to sign the certificate.
 */
export interface CertificateFields {
  subject: Array<{ name: string; value: string }>;
  issuer: Array<{ name: string; value: string }>;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  publicKey: string;
  signatureAlgorithm: string;
}

/**
 * @description Classe que representa um Certificado que pode converter arquivos PFX (PKCS#12) para o formato PEM.
 * Ela fornece métodos para extrair certificados e chaves privadas de arquivos PFX e
 * convertê-los para o formato PEM. O formato PEM é frequentemente usado para importar/exportar certificados
 * e chaves em ambientes como servidores web ou serviços em nuvem.
 */
export class CertificateP12 {
  private readonly pfxData: P12Payload;

  /**
   * @description Construtor da classe para inicializar a instância do Certificado com um arquivo PFX e uma senha.
   * O arquivo PFX é fornecido como um `ArrayBuffer`, e a senha é usada para desbloquear
   * a chave privada contida no arquivo PFX.
   *
   * @param {ArrayBuffer} pfx - O buffer contendo os dados do arquivo PFX, normalmente de um arquivo.
   * @param {string} passphrase - A senha usada para descriptografar o arquivo PFX e extrair a chave privada.
   */
  constructor(options: CertificateOptions) {
    const pfxUint8Array = new Uint8Array(options.pfx);
    this.pfxData = {
      bufferString: forge.util.binary.base64.encode(pfxUint8Array),
      pass: options.passphrase,
    };
  }

  /**
   * @description Converte um arquivo PFX (PKCS#12) para o formato PEM.
   * Este método decodifica os dados PFX de base64 e extrai a chave privada e os certificados.
   * Em seguida, classifica os certificados por data de expiração, retornando o certificado com a maior
   * validade e sua respectiva chave privada no formato PEM. Se nenhum certificado ou chave privada
   * for encontrado no arquivo PFX, um erro é lançado.
   *
   * @returns {PemPayload} Um objeto contendo o certificado e a chave privada no formato PEM.
   *
   * @throws {Error} Se nenhum certificado ou chave privada for encontrado no arquivo PFX.
   */
  asPem(): PemPayload {
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
    const certBags = p12.getBags({
      bagType: oids.certBag,
    })[oids.certBag];

    if (!certBags || certBags.length === 0) {
      throw new Error("No certificates found in the PFX file.");
    }

    // Sort certificates by expiration date (oldest first)
    certBags.sort((a, b) => {
      return (
        new Date(a.cert?.validity.notAfter ?? 0).getTime() -
        new Date(b.cert?.validity.notAfter ?? 0).getTime()
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
    if (!certBags[0]?.cert) {
      throw new Error("No valid certificate found in the PFX file.");
    }
    const cert = pki.certificateToPem(certBags[0].cert);
    const key = pki.privateKeyInfoToPem(privateKeyInfo);

    const pem: PemPayload = { cert: cert, key: key };

    // Return the certificate and private key in PEM format
    return pem;
  }

  /**
   * @description Extrai campos do certificado PEM.
   * Este método pega um certificado PEM e extrai campos importantes como
   * sujeito, emissor, período de validade, número de série, chave pública e algoritmo de assinatura.
   *
   * @returns {CertificateFields} Um objeto contendo os campos extraídos do certificado.
   */
  getPemFields(): CertificateFields {
    const pem = this.asPem();

    const pki = forge.pki;
    const cert = pki.certificateFromPem(pem.cert);

    const certFields = {
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

    return certFields;
  }
}
