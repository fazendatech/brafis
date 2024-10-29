function calcVerifierDigit(digits: string): number {
  let factor = 18 - digits.length;
  let sum = 0;

  for (const d of digits) {
    sum += Number(d) * factor;
    factor += 1;
    if (factor === 10) {
      factor = 2;
    }
  }

  const mod = sum % 11;
  return mod === 10 ? 0 : mod;
}

/**
 * @description Verifica se um CNPJ é válido.
 *
 * @param cnpj
 * @param options
 * @returns
 */
export function isValidCnpj(
  cnpj: string,
  options?: { strict?: boolean },
): boolean {
  const regex = options?.strict ? /[-\\/.]/g : /[^\d]/g;
  const stripped = cnpj.replace(regex, "");

  if (stripped.length !== 14) {
    return false;
  }
  if (new Set(stripped).size === 1) {
    return false;
  }

  let cnpjGen = stripped.slice(0, 12);
  cnpjGen += `${calcVerifierDigit(cnpjGen)}`;
  cnpjGen += `${calcVerifierDigit(cnpjGen)}`;

  return cnpjGen === stripped;
}
