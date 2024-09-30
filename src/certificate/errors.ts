export class NoBagsFoundError extends Error {
  constructor(bagType: string) {
    super(`No bags of type ${bagType} found in the PFX file.`);
    this.name = "NoBagsFoundError";
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
