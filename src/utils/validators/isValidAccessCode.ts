function verifierDigit(digits: string): number {
  let factor = 4;
  let sum = 0;
  for (const d of digits) {
    sum += Number(d) * factor;
    factor -= 1;
    if (factor === 1) {
      factor = 9;
    }
  }
  const dv = 11 - (sum % 11);
  return dv > 9 ? 0 : dv;
}

/**
 * @description Verifica se uma chave de acesso de NF-e é válida.
 *
 * @param accessCode
 * @param options
 * @returns
 */
export function isValidAccessCode(
  accessCode: string,
  options?: { strict?: boolean },
): boolean {
  const regex = options?.strict ? /[- .]/g : /[^\d]/g;
  const stripped = accessCode.replace(regex, "");

  if (stripped.length !== 44) {
    return false;
  }

  let accessCodeGen = stripped.slice(0, 43);
  accessCodeGen += `${verifierDigit(accessCodeGen)}`;

  return accessCodeGen === stripped;
}
