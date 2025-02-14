// biome-ignore lint/correctness/noNodejsModules:
import fs from "node:fs/promises";
import { errorHasMessage } from "@/utils/errors";
import forge from "node-forge";
import {
  CertificateExpiredError,
  InvalidPasswordError,
  InvalidPfxError,
  NoCertificatesFoundError,
  NoPrivateKeyFoundError,
} from "./errors";
import type {
  CertificateFields,
  CertificateP12AsPemOptions,
  CertificateP12Options,
  P12Payload,
  PemPayload,
} from "./types";

/**
 * @description Representa um Certificado PFX (PKCS#12).
 */
export class CertificateP12 {
  private readonly payload: P12Payload;

  /**
   * @param {CertificateP12Options} options
   */
  constructor(options: CertificateP12Options) {
    this.payload = {
      raw: new Uint8Array(options.pfx),
      password: options.password,
    };
  }

  /**
   * @description Cria uma instância de CertificateP12 a partir de um arquivo PFX.
   *
   * @param options - Caminho do arquivo e senha para descriptografar os dados PFX.
   *
   * @returns {CertificateP12}
   */
  static async fromFilepath(options: {
    filepath: string;
    password: string;
  }): Promise<CertificateP12> {
    const pfx = await fs.readFile(options.filepath);
    return new CertificateP12({ pfx, password: options.password });
  }

  /**
   * @description Recupera o conteúdo bags de um tipo especifico de um arquivo PKCS#12.
   */
  private getBags(
    p12: forge.pkcs12.Pkcs12Pfx,
    bagType: string,
  ): forge.pkcs12.Bag[] {
    return p12.getBags({ bagType })[bagType] ?? [];
  }

  /**
   * @description Recupera a chave privada de um arquivo PKCS#12.
   */
  private getPrivateKey(
    p12: forge.pkcs12.Pkcs12Pfx,
  ): forge.pki.PrivateKey | null {
    const keyBags = this.getBags(p12, forge.pki.oids.pkcs8ShroudedKeyBag);
    const unencryptedKeyBags = this.getBags(p12, forge.pki.oids.keyBag);
    const [keyData] = keyBags.concat(unencryptedKeyBags);

    return keyData?.key ?? null;
  }

  /**
   * @description Recupera o certificado de um arquivo PKCS#12.
   */
  private getCertificate(
    p12: forge.pkcs12.Pkcs12Pfx,
  ): forge.pki.Certificate | null {
    const certBags = this.getBags(p12, forge.pki.oids.certBag);

    // NOTE: Certificado escolhido é sempre o que expira por último
    const [certBag] = certBags
      .filter((bag) => bag.cert)
      .sort(
        (a, b) =>
          (b.cert?.validity.notAfter.getTime() ?? 0) -
          (a.cert?.validity.notAfter.getTime() ?? 0),
      );

    return certBag?.cert ?? null;
  }

  /**
   * @description Converte um certificado PKCS#12 para o formato PEM.
   *
   * @param {CertificateP12AsPemOptions} options - Opções para a conversão.
   *
   * @returns {PemPayload} Um objeto contendo o certificado e a chave privada no formato PEM.
   *
   * @throws {NoPrivateKeyFoundError} Quando o arquivo não contém qualquer chave privada.
   * @throws {NoCertificatesFoundError} Quando o arquivo não possui qualquer certificado válido.
   */
  asPem(options?: CertificateP12AsPemOptions): PemPayload {
    let privateKey: forge.pki.PrivateKey | null = null;
    let certificate: forge.pki.Certificate | null = null;

    try {
      // NOTE: Uint8Array -> base64 -> forge.Bytes -> ASN.1
      const p12Asn1 = forge.asn1.fromDer(
        forge.util.decode64(forge.util.binary.base64.encode(this.payload.raw)),
      );

      const p12 = forge.pkcs12.pkcs12FromAsn1(
        p12Asn1,
        true,
        this.payload.password,
      );
      privateKey = this.getPrivateKey(p12);
      certificate = this.getCertificate(p12);
    } catch (error) {
      if (errorHasMessage(error, "Too few bytes to parse DER.")) {
        throw new InvalidPfxError();
      }
      if (
        errorHasMessage(
          error,
          "PKCS#12 MAC could not be verified. Invalid password?",
        )
      ) {
        throw new InvalidPasswordError();
      }
    }

    if (!privateKey) {
      throw new NoPrivateKeyFoundError();
    }

    if (!certificate) {
      throw new NoCertificatesFoundError();
    }

    if (certificate.validity.notAfter < new Date()) {
      if (options?.allowExpired) {
        // FIXME: Atualizar quando implementar o logger
        // biome-ignore lint/suspicious/noConsole:
        console.warn(
          `Certificate expired on ${certificate.validity.notAfter.toISOString()}`,
        );
      } else {
        throw new CertificateExpiredError(
          `Certificate expired on ${certificate.validity.notAfter.toISOString()}`,
        );
      }
    }

    const rsaPrivateKey = forge.pki.privateKeyToAsn1(privateKey);
    const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);

    const cert = forge.pki.certificateToPem(certificate);
    const key = forge.pki.privateKeyInfoToPem(privateKeyInfo);

    return { cert, key };
  }

  /**
   * @description Mapeia os atributos do issuer e subject de um certificado
   */
  private mapCertificateFieldAttributes(
    attributes: forge.pki.CertificateField[],
  ): Record<string, string> {
    const mappedAttributes: Record<string, string> = {};
    for (const attr of attributes) {
      if (attr.name && typeof attr.value === "string") {
        mappedAttributes[attr.name] = attr.value;
      }
    }
    return mappedAttributes;
  }

  /**
   * @description Extrai campos do certificado PEM.
   *
   * @returns {CertificateFields}
   */
  getPemFields(): CertificateFields {
    const pem = this.asPem();
    const cert = forge.pki.certificateFromPem(pem.cert);

    return {
      subject: this.mapCertificateFieldAttributes(cert.subject.attributes),
      issuer: this.mapCertificateFieldAttributes(cert.issuer.attributes),
      validFrom: cert.validity.notBefore,
      validTo: cert.validity.notAfter,
      serialNumber: cert.serialNumber,
      signatureAlgorithm: forge.pki.oids[cert.siginfo.algorithmOid],
    };
  }
}
