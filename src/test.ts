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

// biome-ignore lint/suspicious/noConsoleLog: This is a test file
// biome-ignore lint/suspicious/noConsole: This is a test file
console.log(JSON.stringify(statusServ, null, 2));

const consCad = await service.consultaCadastro({
  CPF: process.env.TEST_CPF ?? "",
});
// biome-ignore lint/suspicious/noConsoleLog: This is a test file
// biome-ignore lint/suspicious/noConsole: This is a test file
console.log(JSON.stringify(consCad, null, 2));

const consProt = await service.consultaProtocolo({
  chNFe: process.env.TEST_CHNFE ?? "",
});
// biome-ignore lint/suspicious/noConsoleLog: This is a test file
// biome-ignore lint/suspicious/noConsole: This is a test file
console.log(JSON.stringify(consProt, null, 2));

const dfe = await service.distribuicaoDfe({
  CPF: process.env.TEST_CERTIFICATE_CPF ?? "",
  consChNFe: { chNFe: process.env.TEST_CHNFE ?? "" },
});
// biome-ignore lint/suspicious/noConsoleLog: This is a test file
// biome-ignore lint/suspicious/noConsole: This is a test file
console.log(JSON.stringify(dfe, null, 2));
