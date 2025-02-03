import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { file } from "bun";
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

  const pfxCertificate = await file(
    `${sampleCertificatesPath}cert.pfx`,
  ).bytes();
  const pemCertificate = await file(`${sampleCertificatesPath}cert.pem`).text();
  const pemKey = await file(`${sampleCertificatesPath}key.pem`).text();

  const pfxCertificateExpired = await file(
    `${sampleCertificatesPath}cert-expired.pfx`,
  ).bytes();
  const pemCertificateExpired = await file(
    `${sampleCertificatesPath}cert-expired.pem`,
  ).text();
  const pemKeyExpired = await file(
    `${sampleCertificatesPath}key-expired.pem`,
  ).text();

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
      const invalidPfx = new Uint8Array();
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
