import { file } from "bun";
import { describe, test, expect } from "bun:test";
import { CertificateP12 } from "./index.ts";
import {
  InvalidPasswordError,
  NoCertificatesFoundError,
  NoPrivateKeyFoundError,
} from "./errors.ts";

describe("CertificateP12", async () => {
  const selfSignedPath = "./src/misc/sample-certificates/";
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

  test.todo("Throws NoCertificatesFoundError if file has expired certificates");

  //TODO: Generate a PFX file with no private key
  test.todo(
    "Throws NoPrivateKeyFoundError if no private key found in PFX file",
    () => {
      expect().toThrowError(NoPrivateKeyFoundError);
    },
  );

  //TODO: Generate a PFX file with no certificates
  test.todo("Throws NoCertificatesFoundError if no certificates found", () => {
    expect().toThrowError(NoCertificatesFoundError);
  });

  test("Throws InvalidPasswordError on invalid password", () => {
    const cert = new CertificateP12({
      pfx: selfSignedPfxBuffer,
      password: "wrongpass",
    });

    expect(() => cert.asPem()).toThrowError(InvalidPasswordError);
  });
});
