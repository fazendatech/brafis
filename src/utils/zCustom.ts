import { z } from "zod";

import { isValidCnpj } from "@/utils/validators/isValidCnpj";
import { isValidCpf } from "@/utils/validators/isValidCpf";
import { isValidIe } from "@/utils/validators/isValidIe";

const range = (min: number, max: number) => z.string().min(min).max(max);
const numeric = () => z.string().regex(/^\d+$/, "Use only digits");
const decimal = (beforeComma: number, afterComma: number) => {
  return z
    .string()
    .regex(
      new RegExp(`^\\d{1,${beforeComma}}(,\\d{1,${afterComma}})?$`),
      "Use decimal number with comma",
    );
};
const date = () => z.string().datetime({ precision: 0 });
const ie = () =>
  numeric()
    .min(8)
    .max(14)
    .refine((value) => isValidIe(value));
const cnpj = () =>
  numeric()
    .length(14)
    .refine((value) => isValidCnpj(value));
const cpf = () =>
  numeric()
    .length(11)
    .refine((value) => isValidCpf(value));
const phone = () =>
  numeric()
    .min(6)
    .max(14)
    .regex(/^(\d{2,3})?\d{2}\d{8,9}$/);
const placa = () =>
  z
    .string()
    .regex(/^(?:[A-Z]{3}[0-9]{3,4}|[A-Z]{2}[0-9]{4}|[A-Z]{4}[0-9]{3})$/, {
      message:
        "Formatos de placas válidas: XXX9999, XXX999, XX9999, or XXXX999.",
    });

function hasOnlyOne<T>(values: T[]) {
  values.filter((v) => v !== undefined);
  return values.length === 1;
}
function hasAllOrNothing<T>(values: T[]) {
  const len = values.length;
  values.filter((v) => v !== undefined);
  return values.length === len || values.length === 0;
}

export const zCustom = {
  string: {
    range,
    date,
    numeric,
    decimal,
    ie,
    cpf,
    cnpj,
    phone,
    placa,
  },
  utils: {
    hasOnlyOne,
    hasAllOrNothing,
  },
};
