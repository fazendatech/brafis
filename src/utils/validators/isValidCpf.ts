function calcVerifierDigit(digits: string): number {
  let factor = 10 - digits.length;
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
 * @description Verifica se um CPF é válido.
 *
 * @param cpf
 * @param options
 * @returns
 */
export function isValidCpf(
  cpf: string,
  options?: { strict?: boolean },
): boolean {
  const regex = options?.strict ? /[.-]/g : /[^\d]/g;
  const stripped = cpf.replace(regex, "");

  if (stripped.length !== 11) {
    return false;
  }
  if (new Set(stripped).size === 1) {
    return false;
  }
  if (stripped.startsWith("123456789")) {
    return false;
  }

  let cpfGen = stripped.slice(0, 9);
  cpfGen += `${calcVerifierDigit(cpfGen)}`;
  cpfGen += `${calcVerifierDigit(cpfGen)}`;

  return cpfGen === stripped;
}
