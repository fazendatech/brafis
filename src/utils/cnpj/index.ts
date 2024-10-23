export interface ValidateResponse {
  valid: boolean;
  use: string;
}

const leadingNonDigitsRegex = /\D/g;
const leadingZerosRegex = /^0+/;

/**
 * @description Valida um CNPJ.
 */

export function validateCNPJ(CNPJ: string): ValidateResponse {
  const cnpj = CNPJ.replace(leadingNonDigitsRegex, "");

  if (cnpj.length !== 14) {
    return { valid: false, use: "" };
  }

  let D13 = 0;
  let D14 = 0;

  for (let i = 0, coef13 = 5, coef14 = 6; i < 13; i++, coef13--, coef14--) {
    if (coef13 === 1) {
      coef13 = 9;
    }
    if (coef14 === 1) {
      coef14 = 9;
    }
    if (i < 12) {
      D13 += Number.parseInt(cnpj[i]) * coef13;
    }
    D14 += Number.parseInt(cnpj[i]) * coef14;
  }
  D13 %= 11;
  D14 %= 11;

  if (
    (D13 < 2
      ? Number.parseInt(cnpj[12]) !== 0
      : Number.parseInt(cnpj[12]) !== 11 - D13) ||
    (D14 < 2
      ? Number.parseInt(cnpj[13]) !== 0
      : Number.parseInt(cnpj[13]) !== 11 - D14)
  ) {
    return { valid: false, use: "" };
  }

  return { valid: true, use: cnpj.replace(leadingZerosRegex, "") };
}
