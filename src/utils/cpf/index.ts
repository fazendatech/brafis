/**
 * @description Valida um CPF.
 */
export function validateCPF(cpf: string): boolean {
  if (cpf.length !== 11) {
    return false;
  }

  let D10 = 0;
  let D11 = 0;

  for (let i = 0; i < 10; i++) {
    if (i < 9) {
      D10 += Number.parseInt(cpf[i]) * (10 - i);
    }
    D11 += Number.parseInt(cpf[i]) * (11 - i);
  }
  D10 %= 11;
  D11 %= 11;

  if (
    (D10 < 2
      ? Number.parseInt(cpf[9]) !== 0
      : Number.parseInt(cpf[9]) !== 11 - D10) ||
    (D11 < 2
      ? Number.parseInt(cpf[10]) !== 0
      : Number.parseInt(cpf[10]) !== 11 - D11)
  ) {
    return false;
  }

  return true;
}
