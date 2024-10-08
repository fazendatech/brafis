import { CertificateP12 } from "./certificate";
import { NfeWebServices } from "./dfe/nfe";

const certificate = await CertificateP12.fromFilepath({
  filepath: process.env.TEST_CERTIFICATE_PATH ?? "",
  password: process.env.TEST_CERTIFICATE_PASSWORD ?? "",
});

const service = new NfeWebServices({
  uf: "DF",
  env: "qa",
  certificate: certificate,
});

const stautsServicoResponse = await service.statusServico();
console.log(stautsServicoResponse);
