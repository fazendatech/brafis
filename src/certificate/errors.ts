/**
 * @description Não foi possível extrair conteúdo do arquivo PFX.
 */
export class InvalidPfxError extends Error {
  constructor() {
    super("PFX must be a valid and non-empty Uint8Array");
    this.name = "InvalidPfxError";
  }
}

/**
 * @description Senha inválida para o arquivo PFX
 */
export class InvalidPasswordError extends Error {
  constructor() {
    super("Password must be a non-empty string");
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
