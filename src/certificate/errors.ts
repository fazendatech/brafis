export class InvalidPfxError extends Error {
  constructor() {
    super("PFX must be a valid and non-empty Uint8Array");
    this.name = "InvalidPfxError";
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super("Password must be a non-empty string");
    this.name = "InvalidPasswordError";
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
