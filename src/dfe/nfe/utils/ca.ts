import { file } from "bun";

/**
 * @description Carrega o certificado da cadeia de certificação da NF-e (www1.nfe.fazenda.gov.br).
 * Disponível em https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=/NJarYc9nus=
 * Link direto https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=JuhROOiTOPA=
 * Última atualização: 2021-08-04
 *
 * @returns {Promise<string>}
 */
export async function loadNfeCa(): Promise<string> {
  return await file("./misc/nfe-ca.pem").text();
}
