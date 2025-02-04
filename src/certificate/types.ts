/**
 * @description Opções para configurar um certificado.
 *
 * @property {Buffer} pfx - Dados PFX (Personal Information Exchange) para o certificado.
 * @property {string} password - Senha para descriptografar os dados PFX.
 */
export interface CertificateP12Options {
  pfx: Buffer;
  password: string;
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
 * @description Representa o formato PFX (PKCS#12).
 *
 * @property {Uint8Array} raw - Os dados PFX (Personal Information Exchange).
 * @property {string} password - A senha para descriptografar os dados PFX.
 */
export interface P12Payload {
  raw: Uint8Array;
  password: string;
}

/**
 * @description Representa os campos de um certificado.

 * @property {Record<string, string>} subject - Dados do requerente do certificado
 * @property {Record<string, string>} issuer - Dados do emissor do certificado
 * @property {Date} validFrom - A data a partir da qual o certificado é válido.
 * @property {Date} validTo - A data até a qual o certificado é válido.
 * @property {string} serialNumber - O número de série do certificado.
 * @property {string} signatureAlgorithm - O algoritmo usado para assinar o certificado. E.g. `sha256WithRSAEncryption`, `rsaEncryption`, ...
 */
export interface CertificateFields {
  subject: Record<string, string>;
  issuer: Record<string, string>;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  signatureAlgorithm: string;
}

export interface CertificateP12AsPemOptions {
  allowExpired?: boolean;
}
