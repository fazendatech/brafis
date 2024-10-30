import { z } from "zod";

import { isValidCnpj } from "@/utils/validators/isValidCnpj";
import { isValidCpf } from "@/utils/validators/isValidCpf";
import { isValidIe } from "@/utils/validators/isValidIe";

const stringRange = (min: number, max: number) => z.string().min(min).max(max);

const stringNumeric = () => z.string().regex(/^\d+$/, "Use only digits");
const stringDecimal = () =>
  z.string().regex(/^\d+,\d{2}$/, "Use decimal number with comma");

const stringDate = () => z.string().datetime({ precision: 0 });

const stringIe = () =>
  stringNumeric()
    .min(8)
    .max(14)
    .refine((value) => isValidIe(value));
const stringCnpj = () =>
  stringNumeric()
    .length(14)
    .refine((value) => isValidCnpj(value));
const stringCpf = () =>
  stringNumeric()
    .length(11)
    .refine((value) => isValidCpf(value));

function hasOnlyOne<T>(values: T[]) {
  values.filter(Boolean);
  return values.length === 1;
}

function hasAll<T>(values: T[]) {
  const len = values.length;
  values.filter(Boolean);
  return values.length === len;
}

export const zCustom = {
  string: {
    range: stringRange,
    date: stringDate,
    numeric: stringNumeric,
    decimal: stringDecimal,

    ie: stringIe,
    cpf: stringCpf,
    cnpj: stringCnpj,
  },
  utils: {
    hasOnlyOne,
    hasAll,
  },
};
