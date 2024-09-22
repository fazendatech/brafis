import { describe, test, expect } from "bun:test";
import { Certificate } from "./index.ts";
import { file } from "bun";

// Função utilitária para resolver o caminho correto do arquivo
function resolvePath(filePath: string): string {
  // Obtém o diretório do arquivo de teste
  const testDir = new URL(".", import.meta.url).pathname;
  return new URL(filePath, `file://${testDir}`).pathname;
}

// Função para ler arquivos PFX usando a API do Bun
async function readPfxFile(filePath: string): Promise<Buffer> {
  const fileBuffer = await file(resolvePath(filePath)).arrayBuffer();
  return Buffer.from(fileBuffer);
}

// Função para ler arquivos PEM como string
async function readPemFile(filePath: string): Promise<string> {
  const fileBuffer = await file(resolvePath(filePath)).text();
  return fileBuffer.replace(/\n/g, "\r\n");
}

describe("Certificate", () => {
  test("Creates a new instance of Certificate", async () => {
    const autoSignedPfxBuffer: Buffer = await readPfxFile(
      "./test/autoSigned.cert.pfx",
    );
    const passphrase: string = "senha";
    const cert = new Certificate(autoSignedPfxBuffer, passphrase);
    expect(cert).toBeInstanceOf(Certificate);
  });

  test("Convert PFX to PEM format", async () => {
    const autoSignedPfxBuffer: Buffer = await readPfxFile(
      "./test/autoSigned.cert.pfx",
    );
    const passphrase: string = "senha";
    const autoSignedPemCert: string = await readPemFile(
      "./test/autoSigned.cert.pem",
    );
    const autoSignedPemKey: string = await readPemFile(
      "./test/autoSigned.key.pem",
    );

    const cert = new Certificate(autoSignedPfxBuffer, passphrase);
    const pem = cert.pem;
    expect(pem.cert).not.toEqual("");
    expect(pem.key).not.toEqual("");
    expect(pem.cert).toEqual(autoSignedPemCert);
    expect(pem.key).toEqual(autoSignedPemKey);
  });
});
