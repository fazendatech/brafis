/**
 * @description Opções para configurar um certificado.
 *
 * @property {Uint8Array} pfx - Dados PFX (Personal Information Exchange) para o certificado.
 * @property {string} passphrase - Senha para descriptografar os dados PFX.
 */
export interface CertificateP12Options {
  pfx: Uint8Array;
  passphrase: string;
}

/**
 * @description Representa o formato PEM (Privacy-Enhanced Mail).
 *
 * @property {string} cert - Dados PEM (Privacy-Enhanced Mail) para o certificado.
 * @property {string} key - Chave privada armazenada com os dados PFX.
 */
export interface PemPayload {
  cert: string;
  key: string;
}

/**
 * @description Rrepresenta o formato PFX (PKCS#12).
 *
 * @property {string} bufferString - Os dados PFX (Personal Information Exchange) em uma string base64.
 * @property {string} pass - A senha para descriptografar os dados PFX.
 */
export interface P12Payload {
  bufferString: string;
  pass: string;
}

/**
 * @description Representa os campos de um certificado.

 * @property {Array<{ name: string; value: string }>} subject - Dados do requerente do certificado
 * @property {Array<{ name: string; value: string }>} issuer - Dados do emissor do certificado
 * @property {Date} validFrom - A data a partir da qual o certificado é válido.
 * @property {Date} validTo - A data até a qual o certificado é válido.
 * @property {string} serialNumber - O número de série do certificado.
 * @property {string} publicKey - A chave pública associada ao certificado.
 * @property {string} signatureAlgorithm - O algoritmo usado para assinar o certificado. E.g. `sha256WithRSAEncryption`, `rsaEncryption`, ...
 */
export interface CertificateP12Fields {
  subject: Record<string, string>;
  issuer: Record<string, string>;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  signatureAlgorithm: string;
}
