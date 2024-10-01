import forge from "node-forge";
import { file } from "bun";
import { describe, test, expect, spyOn } from "bun:test";
import { CertificateP12 } from "./index.ts";
import {
  InvalidPasswordError,
  InvalidPfxError,
  NoCertificatesFoundError,
  NoPrivateKeyFoundError,
} from "./errors.ts";

describe("CertificateP12", async () => {
  const selfSignedPath = "./misc/sample-certificates/";
  const selfSignedPfxBuffer = await file(`${selfSignedPath}cert.pfx`).bytes();
  const password = "senha";

  const selfSignedPemCert = await file(`${selfSignedPath}cert.pem`).text();
  const selfSignedPemKey = await file(`${selfSignedPath}key.pem`).text();

  test("Convert PFX to PEM format", () => {
    const certificate = new CertificateP12({
      pfx: selfSignedPfxBuffer,
      password,
    });
    const pem = certificate.asPem();

    expect(pem.cert).toEqual(selfSignedPemCert);
    expect(pem.key).toEqual(selfSignedPemKey);
  });

  test("Loads PFX from file", async () => {
    const certificate = await CertificateP12.fromFilepath({
      filepath: `${selfSignedPath}cert.pfx`,
      password,
    });
    const pem = certificate.asPem();

    expect(pem.cert).toEqual(selfSignedPemCert);
    expect(pem.key).toEqual(selfSignedPemKey);
  });

  test("Extracts certificate fields", () => {
    const certificate = new CertificateP12({
      pfx: selfSignedPfxBuffer,
      password,
    });
    const info = certificate.getPemFields();

    expect(info).toMatchSnapshot();
  });

  test("Throws InvalidPfxError on invalid PFX file", () => {
    const invalidPfx = new Uint8Array();
    const certificate = new CertificateP12({ pfx: invalidPfx, password });

    expect(() => certificate.asPem()).toThrowError(InvalidPfxError);
  });

  test("Throws InvalidPasswordError on invalid password", () => {
    const certificate = new CertificateP12({
      pfx: selfSignedPfxBuffer,
      password: "wrongpass",
    });

    expect(() => certificate.asPem()).toThrowError(InvalidPasswordError);
  });

  test("Throws NoPrivateKeyFoundError if no private key found in PFX file", () => {
    spyOn(forge.pkcs12, "pkcs12FromAsn1").mockReturnValueOnce({
      version: "",
      safeContents: [],
      getBags: () => ({}),
      getBagsByFriendlyName: () => [],
      getBagsByLocalKeyId: () => [],
    });

    const certificate = new CertificateP12({
      pfx: selfSignedPfxBuffer,
      password,
    });

    expect(() => certificate.asPem()).toThrowError(NoPrivateKeyFoundError);
  });

  test("Throws NoCertificatesFoundError if no certificates found", () => {
    spyOn(forge.pkcs12, "pkcs12FromAsn1").mockImplementationOnce((...args) => {
      // @ts-ignore: Compiler error is pointless
      const p12 = forge.pkcs12.pkcs12FromAsn1(...args);
      const getBags = p12.getBags;

      // NOTE: Skip the first two calls used by `getPrivateKey`
      spyOn(p12, "getBags")
        .mockImplementationOnce(getBags)
        .mockImplementationOnce(getBags)
        .mockImplementationOnce(() => ({}));

      return p12;
    });

    const certificate = new CertificateP12({
      pfx: selfSignedPfxBuffer,
      password,
    });

    expect(() => certificate.asPem()).toThrowError(NoCertificatesFoundError);
  });
});
