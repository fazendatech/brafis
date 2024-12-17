/**
 * @description Não foi possível extrair conteúdo do arquivo PFX.
 */
export class InvalidPfxError extends Error {
  constructor() {
    super("PFX must have valid certificate content.");
    this.name = "InvalidPfxError";
  }
}

/**
 * @description Senha inválida para o arquivo PFX
 */
export class InvalidPasswordError extends Error {
  constructor() {
    super("Invalid password.");
    this.name = "InvalidPasswordError";
  }
}

/**
 * @description Não foi possível encontrar uma chave privada no conteúdo do arquivo.
 */
export class NoPrivateKeyFoundError extends Error {
  constructor() {
    super("No private key found in the PFX file.");
    this.name = "NoPrivateKeyFoundError";
  }
}

/**
 * @description Não foi possível encontrar um certificado válido no conteúdo do arquivo.
 */
export class NoCertificatesFoundError extends Error {
  constructor() {
    super("No valid certificates found in the PFX file.");
    this.name = "NoCertificatesFoundError";
  }
}

/**
 * @description Certificado expirado.
 */
export class CertificateExpiredError extends Error {
  constructor() {
    super("Certificate is expired.");
    this.name = "CertificateExpiredError";
  }
}
