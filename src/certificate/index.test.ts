import { file } from "bun";
import { describe, test, expect } from "bun:test";
import forge from "node-forge";
import { CertificateP12 } from "./index.ts";
import { NoCertificatesFoundError, NoPrivateKeyFoundError } from "./errors.ts";

describe("Certificate", async () => {
  const selfSignedPath = "./src/misc/sample-certificates/";
  const selfSignedPfxBuffer = await file(`${selfSignedPath}cert.pfx`).bytes();
  const passphrase = "senha";

  const selfSignedPemCert = await file(`${selfSignedPath}cert.pem`).text();
  const selfSignedPemKey = await file(`${selfSignedPath}key.pem`).text();

  test("Convert PFX to PEM format", () => {
    const options = { pfx: selfSignedPfxBuffer, passphrase };
    const cert = new CertificateP12(options);
    const pem = cert.asPem();

    expect(pem.cert).toEqual(selfSignedPemCert);
    expect(pem.key).toEqual(selfSignedPemKey);
  });

  test("Extracts certificate fields", () => {
    const cert = new CertificateP12({ pfx: selfSignedPfxBuffer, passphrase });
    const certInfo = cert.getPemFields();

    expect(certInfo).toMatchSnapshot();
  });

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

  test("Throws error on invalid passphrase", () => {
    const options = { pfx: selfSignedPfxBuffer, passphrase: "wrongpass" };
    const cert = new CertificateP12(options);

    expect(() => cert.asPem()).toThrowError();
  });
});
