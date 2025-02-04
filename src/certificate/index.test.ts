import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
// biome-ignore lint/correctness/noNodejsModules: <explanation>
import fs from "node:fs/promises";
import forge from "node-forge";
import { CertificateP12 } from ".";
import {
  CertificateExpiredError,
  InvalidPasswordError,
  InvalidPfxError,
  NoCertificatesFoundError,
  NoPrivateKeyFoundError,
} from "./errors";

describe("CertificateP12", async () => {
  const sampleCertificatesPath = "./misc/sample-certificates/";
  const pfxPassword = "senha";

  const pfxCertificate = await fs.readFile(`${sampleCertificatesPath}cert.pfx`);
  const pemCertificate = await fs.readFile(
    `${sampleCertificatesPath}cert.pem`,
    { encoding: "utf-8" },
  );
  const pemKey = await fs.readFile(`${sampleCertificatesPath}key.pem`, {
    encoding: "utf-8",
  });

  const pfxCertificateExpired = await fs.readFile(
    `${sampleCertificatesPath}cert-expired.pfx`,
  );
  const pemCertificateExpired = await fs.readFile(
    `${sampleCertificatesPath}cert-expired.pem`,
    { encoding: "utf-8" },
  );
  const pemKeyExpired = await fs.readFile(
    `${sampleCertificatesPath}key-expired.pem`,
    { encoding: "utf-8" },
  );

  afterEach(() => {
    mock.restore();
  });

  describe("asPem", () => {
    test("Converts PFX to PEM format", () => {
      const certificate = new CertificateP12({
        pfx: pfxCertificate,
        password: pfxPassword,
      });

      const pem = certificate.asPem();

      expect(pem.cert).toEqual(pemCertificate);
      expect(pem.key).toEqual(pemKey);
    });

    test("Converts PFX to PEM format on expired certificate", () => {
      const certificate = new CertificateP12({
        pfx: pfxCertificateExpired,
        password: pfxPassword,
      });

      const pem = certificate.asPem({ allowExpired: true });

      expect(pem.cert).toEqual(pemCertificateExpired);
      expect(pem.key).toEqual(pemKeyExpired);
    });

    test("Throws InvalidPfxError", () => {
      const invalidPfx = Buffer.from("");
      const certificate = new CertificateP12({
        pfx: invalidPfx,
        password: pfxPassword,
      });

      expect(() => certificate.asPem()).toThrowError(InvalidPfxError);
    });

    test("Throws InvalidPasswordError", () => {
      const certificate = new CertificateP12({
        pfx: pfxCertificate,
        password: "wrongpass",
      });

      expect(() => certificate.asPem()).toThrowError(InvalidPasswordError);
    });

    test("Throws NoPrivateKeyFoundError", () => {
      spyOn(forge.pkcs12, "pkcs12FromAsn1").mockReturnValueOnce({
        version: "",
        safeContents: [],
        getBags: () => ({}),
        getBagsByFriendlyName: () => [],
        getBagsByLocalKeyId: () => [],
      });

      const certificate = new CertificateP12({
        pfx: pfxCertificate,
        password: pfxPassword,
      });

      expect(() => certificate.asPem()).toThrowError(NoPrivateKeyFoundError);
    });

    test("Throws NoCertificatesFoundError", () => {
      spyOn(forge.pkcs12, "pkcs12FromAsn1").mockImplementationOnce(
        (...args) => {
          // @ts-ignore: Compiler error is pointless
          const p12 = forge.pkcs12.pkcs12FromAsn1(...args);
          const getBags = p12.getBags;

          // NOTE: Skip the first two calls used by `getPrivateKey`
          spyOn(p12, "getBags")
            .mockImplementationOnce(getBags)
            .mockImplementationOnce(getBags)
            .mockImplementationOnce(() => ({}));

          return p12;
        },
      );

      const certificate = new CertificateP12({
        pfx: pfxCertificate,
        password: pfxPassword,
      });

      expect(() => certificate.asPem()).toThrowError(NoCertificatesFoundError);
    });

    test("Throws CertificateExpiredError", () => {
      const certificate = new CertificateP12({
        pfx: pfxCertificateExpired,
        password: pfxPassword,
      });

      expect(() => certificate.asPem()).toThrowError(CertificateExpiredError);
    });
  });

  describe("fromFilepath", () => {
    test("Loads PFX from file", async () => {
      const certificate = await CertificateP12.fromFilepath({
        filepath: `${sampleCertificatesPath}cert.pfx`,
        password: pfxPassword,
      });
      const pem = certificate.asPem();

      expect(pem.cert).toEqual(pemCertificate);
      expect(pem.key).toEqual(pemKey);
    });
  });

  describe("getPemFields", () => {
    test("Extracts certificate fields", () => {
      const certificate = new CertificateP12({
        pfx: pfxCertificate,
        password: pfxPassword,
      });
      const info = certificate.getPemFields();

      expect(info).toMatchSnapshot();
    });
  });
});
