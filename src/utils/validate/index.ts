export function isValidCnpj(cnpj: string): boolean {
  let D13 = 0;
  let D14 = 0;

  for (let i = 0, coef = 6; i < 13; i++, coef--) {
    if (coef === 1) {
      coef = 9;
    }
    if (i < 12) {
      D13 += Number.parseInt(cnpj[i]) * (coef - 1 === 1 ? 9 : coef - 1);
    }
    D14 += Number.parseInt(cnpj[i]) * coef;
  }
  D13 %= 11;
  D14 %= 11;

  return !(
    (D13 < 2
      ? Number.parseInt(cnpj[12]) !== 0
      : Number.parseInt(cnpj[12]) !== 11 - D13) ||
    (D14 < 2
      ? Number.parseInt(cnpj[13]) !== 0
      : Number.parseInt(cnpj[13]) !== 11 - D14)
  );
}

export function isValidCpf(cpf: string): boolean {
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

  return !(
    (D10 < 2
      ? Number.parseInt(cpf[9]) !== 0
      : Number.parseInt(cpf[9]) !== 11 - D10) ||
    (D11 < 2
      ? Number.parseInt(cpf[10]) !== 0
      : Number.parseInt(cpf[10]) !== 11 - D11)
  );
}

// TODO: Implementar verdadeiras regras de validação para IE (varia por estado).
export function isValidIe(ie: string): boolean {
  return true;
}
