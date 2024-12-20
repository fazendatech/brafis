import { describe, test, expect, spyOn, afterEach, mock } from "bun:test";
import { file } from "bun";
import forge from "node-forge";

import { CertificateP12 } from ".";
import {
  InvalidPasswordError,
  InvalidPfxError,
  NoCertificatesFoundError,
  NoPrivateKeyFoundError,
} from "./errors";

describe("CertificateP12", async () => {
  const selfSignedPath = "./misc/sample-certificates/";
  const selfSignedPfxBuffer = await file(`${selfSignedPath}cert.pfx`).bytes();
  const password = "senha";

  const selfSignedPemCert = await file(`${selfSignedPath}cert.pem`).text();
  const selfSignedPemKey = await file(`${selfSignedPath}key.pem`).text();

  afterEach(() => {
    mock.restore();
  });

  describe("asPem", () => {
    test("Converts PFX to PEM format", () => {
      const certificate = new CertificateP12({
        pfx: selfSignedPfxBuffer,
        password,
      });
      const pem = certificate.asPem();

      expect(pem.cert).toEqual(selfSignedPemCert);
      expect(pem.key).toEqual(selfSignedPemKey);
    });

    test("Throws InvalidPfxError", () => {
      const invalidPfx = new Uint8Array();
      const certificate = new CertificateP12({ pfx: invalidPfx, password });

      expect(() => certificate.asPem()).toThrowError(InvalidPfxError);
    });

    test("Throws InvalidPasswordError", () => {
      const certificate = new CertificateP12({
        pfx: selfSignedPfxBuffer,
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
        pfx: selfSignedPfxBuffer,
        password,
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
        pfx: selfSignedPfxBuffer,
        password,
      });

      expect(() => certificate.asPem()).toThrowError(NoCertificatesFoundError);
    });
  });

  describe("fromFilepath", () => {
    test("Loads PFX from file", async () => {
      const certificate = await CertificateP12.fromFilepath({
        filepath: `${selfSignedPath}cert.pfx`,
        password,
      });
      const pem = certificate.asPem();

      expect(pem.cert).toEqual(selfSignedPemCert);
      expect(pem.key).toEqual(selfSignedPemKey);
    });
  });

  describe("getPemFields", () => {
    test("Extracts certificate fields", () => {
      const certificate = new CertificateP12({
        pfx: selfSignedPfxBuffer,
        password,
      });
      const info = certificate.getPemFields();

      expect(info).toMatchSnapshot();
    });
  });
});
