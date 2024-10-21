import type { CertificateP12 } from "@/certificate";
import type { UF } from "@/ufCode";
import type { Environment } from "@/dfe/nfe/webServiceUrls";

/**
 * @description Opções do `NfeWebServices`.
 *
 * @property {UF} uf - A unidade federativa (estado) para a NF-e.
 * @property {Environment} env - `producao` -> `tpAmb = 1`. `homologacao` -> `tpAmb = 2`.
 * @property {CertificateP12} certificate - O certificado P12 para autenticação.
 * @property {boolean} [contingency] - Habilitar uso do servidor de contingência.
 * @property {number} [timeout] - Timeout da requisição em ms, padrão 15000ms.
 */
export interface NfeWebServicesOptions {
  uf: UF;
  env: Environment;
  certificate: CertificateP12;
  contingency?: boolean;
  timeout?: number;
}
