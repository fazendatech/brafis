export class InvalidPfxError extends Error {
  constructor() {
    super("PFX must be a valid and non-empty Uint8Array");
    this.name = "InvalidPfxError";
  }
}

export class InvalidPassphraseError extends Error {
  constructor() {
    super("Passphrase must be a non-empty string");
    this.name = "InvalidPassphraseError";
  }
}
export class NoPrivateKeyFoundError extends Error {
  constructor() {
    super("No private key found in the PFX file.");
    this.name = "NoPrivateKeyFoundError";
  }
}

export class NoCertificatesFoundError extends Error {
  constructor() {
    super("No valid certificates found in the PFX file.");
    this.name = "NoCertificatesFoundError";
  }
}
