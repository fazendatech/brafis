import { describe, test, expect } from "bun:test";
import { CertificateP12 } from "./index.ts";
import { file } from "bun";
import forge from "node-forge";

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

    expect(pem.cert).not.toEqual("");
    expect(pem.key).not.toEqual("");
    expect(pem.cert).toEqual(selfSignedPemCert);
    expect(pem.key).toEqual(selfSignedPemKey);
  });

  // TODO: Generate a PFX file with no certificates
  test.todo("Throws error if no certificates found in PFX file", () => {
    const p12Asn1 = forge.pkcs12.toPkcs12Asn1(null, [], passphrase, {
      algorithm: "3des",
      friendlyName: "Invalid PFX",
    });
    const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
    const p12ArrayBuffer = new ArrayBuffer(p12Der.length);
    const p12View = new Uint8Array(p12ArrayBuffer);

    const options = { pfx: p12View, passphrase: passphrase };
    const cert = new CertificateP12(options);

    expect(cert.asPem()).toThrowError();
  });

  test("Throws error on invalid passphrase", () => {
    const options = { pfx: selfSignedPfxBuffer, passphrase: "wrongpass" };
    const cert = new CertificateP12(options);

    expect(() => cert.asPem()).toThrowError();
  });

  test("Extracts certificate fields", () => {
    const cert = new CertificateP12({ pfx: selfSignedPfxBuffer, passphrase });
    const certInfo = cert.getPemFields();

    expect(certInfo).toMatchSnapshot();
  });
});
