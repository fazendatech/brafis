import { CertificateP12 } from "@/certificate";
import { NfeWebServices } from "@/dfe/nfe/webServices";

const certificate = await CertificateP12.fromFilepath({
  filepath: process.env.TEST_CERTIFICATE_PATH ?? "",
  password: process.env.TEST_CERTIFICATE_PASSWORD ?? "",
});

const service = new NfeWebServices({
  uf: "DF",
  env: "homologacao",
  certificate: certificate,
});

const statusServ = await service.statusServico();
const consCad = await service.consultaCadastro({
  CPF: process.env.TEST_CPF ?? "",
});

console.log(JSON.stringify(statusServ, null, 2));
console.log(JSON.stringify(consCad, null, 2));
