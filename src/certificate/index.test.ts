import { describe, test, expect } from "bun:test";
import { CertificateP12, type CertificateOptions } from "./index.ts";
import { file } from "bun";

/**
 * @description Utility function to resolve the correct file path based on the directory of the test file.
 * It uses `import.meta.url` to dynamically determine the directory of the current module
 * and constructs the full path to the file.
 *
 * @param {string} filePath - The relative path to the target file.
 * @returns {string} The absolute path of the file based on the current module's directory.
 *
 * @example
 * // If the test file is located in '/tests/' and the target file is 'cert.pfx'
 * const resolvedPath = resolvePath('cert.pfx');
 * console.log(resolvedPath); // Outputs the full path to 'cert.pfx' based on the test file location
 */
function resolvePath(filePath: string): string {
  const testDir = new URL(".", import.meta.url).pathname;
  return new URL(filePath, `file://${testDir}`).pathname;
}

/**
 * @description Reads a PFX file from the file system using Bun's file API.
 * It resolves the file path based on the test file's directory and reads the file as an ArrayBuffer,
 * then converts it into a Node.js Buffer for further use.
 *
 * @param {string} filePath - The relative path to the PFX file.
 * @returns {Promise<Buffer>} A promise that resolves to the content of the PFX file as a Buffer.
 *
 * @example
 * // Reads the PFX file and converts it into a Buffer
 * readPfxFile('cert.pfx').then((pfxBuffer) => {
 *   console.log(pfxBuffer); // Logs the content of the PFX file as a Buffer
 * });
 */
async function readPfxFile(filePath: string): Promise<ArrayBuffer> {
  const fileBuffer = await file(resolvePath(filePath)).arrayBuffer();
  return fileBuffer;
}

/**
 * @description Reads a PEM file from the file system using Bun's file API.
 * It resolves the file path based on the test file's directory and reads the file as text,
 * then replaces all newline characters (`\n`) with carriage return + newline (`\r\n`).
 *
 * The reason for replacing `\n` with `\r\n` is to ensure compatibility with systems
 * or tools that require Windows-style line endings (`\r\n`), especially when handling
 * certificates that may need specific formatting for correct interpretation.
 *
 * @param {string} filePath - The relative path to the PEM file.
 * @returns {Promise<string>} A promise that resolves to the content of the PEM file as a string.
 *
 * @example
 * // Reads the PEM file and normalizes line endings
 * readPemFile('cert.pem').then((pemContent) => {
 *   console.log(pemContent); // Logs the content of the PEM file as a string with \r\n line endings
 * });
 */
async function readPemFile(filePath: string): Promise<string> {
  const fileBuffer = await file(resolvePath(filePath)).text();
  return fileBuffer.replace(/\n/g, "\r\n");
}

const autoSignedPath = "./test/autoSigned";
const autoSignedPfxBuffer = await readPfxFile(`${autoSignedPath}.cert.pfx`);
const passphrase = "senha";
const autoSignedPemCert = await readPemFile(`${autoSignedPath}.cert.pem`);
const autoSignedPemKey = await readPemFile(`${autoSignedPath}.key.pem`);

describe("Certificate", () => {
  test("Convert PFX to PEM format", () => {
    const options = { pfx: autoSignedPfxBuffer, passphrase: passphrase };
    const cert = new CertificateP12(options);
    const pem = cert.asPem();
    expect(pem.cert).not.toEqual("");
    expect(pem.key).not.toEqual("");
    expect(pem.cert).toEqual(autoSignedPemCert);
    expect(pem.key).toEqual(autoSignedPemKey);
  });

  test("Throws error if no certificates found in PFX file", () => {
    const options = { pfx: autoSignedPfxBuffer, passphrase: "passphrase" };
    const cert = new CertificateP12(options);
    expect(() => cert.asPem()).toThrowError();
  });

  test("Handles invalid passphrase", async () => {
    const invalidPassphrase = "wrongpass";
    const options = { pfx: autoSignedPfxBuffer, passphrase: invalidPassphrase };
    const cert = new CertificateP12(options);
    expect(() => cert.asPem()).toThrowError();
  });

  test("Extracts certificate fields", () => {
    const options = { pfx: autoSignedPfxBuffer, passphrase: passphrase };

    const cert = new CertificateP12(options);
    const certInfo = cert.getPemFields();
    expect(certInfo).toHaveProperty("subject");
    expect(certInfo).toHaveProperty("issuer");
    expect(certInfo).toHaveProperty("validFrom");
    expect(certInfo).toHaveProperty("validTo");
    expect(certInfo).toHaveProperty("publicKey");
    expect(certInfo).toHaveProperty("serialNumber");
    expect(certInfo).toHaveProperty("signatureAlgorithm");
    expect(certInfo.subject).toBeArray();
    expect(certInfo.issuer).toBeArray();
    expect(certInfo).toContainValues([
      "281509806a587f5a74ad144178c320aa93a6a018",
    ]);
  });
});
