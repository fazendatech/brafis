import { z } from "zod";

const schemaValidateOptions = z.object({
  type: z.enum(["IE", "CPF", "CNPJ"]),
  value: z.string().min(2).max(19),
});

/**
 * @description Opções para a função de validação.
 *
 * @property {"IE" | "CPF" | "CNPJ"} type Tipo de documento a ser validado.
 * @property {string} value Valor a ser validado.
 */
export type ValidateOptions = z.infer<typeof schemaValidateOptions>;

/**
 * @description Resposta da função de validação.
 *
 * @property {boolean} valid Indica se o valor é válido.
 * @property {string} [use] Valor a ser utilizado após a validação, sem zeros a esquerda e sem caracteres.
 */
export interface ValidateResponse {
  valid: boolean;
  use?: string;
}

const leadingNonDigitsRegex = /\D/g;
const leadingZerosRegex = /^0+/;

/**
 * @description Valida um CPF ou CNPJ.
 *
 * @param {ValidateOptions} options
 */
export function validate(options: ValidateOptions): ValidateResponse {
  schemaValidateOptions.parse(options);

  const valueOnlyDigits = options.value.replace(leadingNonDigitsRegex, "");
  if (options.type === "IE" && validateIE(valueOnlyDigits)) {
    return { valid: true, use: valueOnlyDigits.replace(leadingZerosRegex, "") };
  }
  if (options.type === "CPF" && validateCPF(valueOnlyDigits)) {
    return { valid: true, use: valueOnlyDigits.replace(leadingZerosRegex, "") };
  }
  if (options.type === "CNPJ" && validateCNPJ(valueOnlyDigits)) {
    return { valid: true, use: valueOnlyDigits.replace(leadingZerosRegex, "") };
  }

  return { valid: false };
}

function validateCNPJ(cnpj: string): boolean {
  if (cnpj.length !== 14) {
    return false;
  }

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

function validateCPF(cpf: string): boolean {
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
function validateIE(ie: string): boolean {
  if (ie.length < 8 || ie.length > 14) {
    return false;
  }

  return true;
}
