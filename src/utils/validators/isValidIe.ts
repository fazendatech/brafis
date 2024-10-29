/**
 * @description Verifica se uma Inscrição Estadual é válida.
 * Apesar das UFs possuírem regras de validação definidas (http://www.sintegra.gov.br/insc_est.html),
 * com frequência essas regras ficam desatualizadas. Portanto, usaremos apenas a regra de tamanho por enquanto.
 *
 * @param ie
 * @param options
 * @returns
 */
export function isValidIe(ie: string, options?: { strict?: boolean }): boolean {
  const regex = options?.strict ? /[.\\-]/g : /[^\d]/g;
  const stripped = ie.replace(regex, "");

  return stripped.length >= 8 && stripped.length <= 14;
}
