import type { CertificateP12 } from "@/certificate";
import type { Environment } from "@/dfe/nfe/webServiceUrls/types";
import type { Uf } from "@/ufCode/types";

/**
 * @description Opções do `NfeWebServices`.
 *
 * @property {Uf} uf - A unidade federativa (estado) para a NF-e.
 * @property {Environment} env - `producao` -> `tpAmb = 1`. `homologacao` -> `tpAmb = 2`.
 * @property {CertificateP12} certificate - O certificado P12 para autenticação.
 * @property {boolean} [contingency] - Habilitar uso do servidor de contingência.
 * @property {number} [timeout] - Timeout da requisição em ms, padrão 15000ms.
 */
export interface NfeWebServicesOptions {
  uf: Uf;
  env: Environment;
  certificate: CertificateP12;
  contingency?: boolean;
  timeout?: number;
}
