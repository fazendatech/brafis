import { describe, test, expect } from "bun:test";
import { CertificateP12 } from "./index.ts";
import { file } from "bun";
import forge from "node-forge";

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

const selfSignedPath = "../misc/selfSigned";
const selfSignedPfxBuffer = await readPfxFile(`${selfSignedPath}.cert.pfx`);
const passphrase = "senha";
const selfSignedPemCert = await readPemFile(`${selfSignedPath}.cert.pem`);
const selfSignedPemKey = await readPemFile(`${selfSignedPath}.key.pem`);

describe("Certificate", () => {
  test("Convert PFX to PEM format", () => {
    const options = { pfx: selfSignedPfxBuffer, passphrase: passphrase };
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

    const options = { pfx: p12ArrayBuffer, passphrase: passphrase };
    const cert = new CertificateP12(options);

    expect(() => cert.asPem()).toThrowError();
  });

  test("Handles invalid passphrase", () => {
    const invalidPassphrase = "wrongpass";
    const options = { pfx: selfSignedPfxBuffer, passphrase: invalidPassphrase };
    const cert = new CertificateP12(options);

    expect(() => cert.asPem()).toThrowError();
  });

  test("Extracts certificate fields", () => {
    const options = { pfx: selfSignedPfxBuffer, passphrase: passphrase };
    const cert = new CertificateP12(options);
    const certInfo = cert.getPemFields();

    expect(certInfo).toMatchSnapshot();
  });
});
