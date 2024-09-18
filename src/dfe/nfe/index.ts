import type { Certificate } from "@/certificate";
import type { Environment, UF } from "@/dfe/nfe/types";

export interface NfeWebServicesOptions {
  uf: UF;
  env: Environment;
  certificate: Certificate;
}

export class NfeWebServices {
  private uf: UF;
  private env: Environment;
  private certificate: Certificate;

  constructor(options: NfeWebServicesOptions) {
    this.uf = options.uf;
    this.env = options.env;
    this.certificate = options.certificate;
  }

  statusServico() {
    throw new Error("Method not implemented.");
  }

  autorizacao() {
    throw new Error("Method not implemented.");
  }
}
