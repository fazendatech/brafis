import { z } from "zod";

import { isValidCnpj } from "@/utils/validators/isValidCnpj";
import { isValidCpf } from "@/utils/validators/isValidCpf";
import { isValidIe } from "@/utils/validators/isValidIe";

const stringRange = (min: number, max: number) => z.string().min(min).max(max);

const stringNumeric = () => z.string().regex(/^\d+$/, "Use only digits");

const stringDate = () => z.string().datetime({ precision: 0 });

const stringRegisterNumber = (
  min: number,
  max: number,
  isValidCallback: (value: string) => boolean,
) =>
  stringNumeric()
    .min(min)
    .max(max)
    .refine((value) => isValidCallback(value))
    .optional();

const stringIe = (min?: number, max?: number) =>
  stringRegisterNumber(min ?? 2, max ?? 14, isValidIe);
const stringCnpj = (min?: number, max?: number) =>
  stringRegisterNumber(min ?? 3, max ?? 14, isValidCnpj);
const stringCpf = (min?: number, max?: number) =>
  stringRegisterNumber(min ?? 3, max ?? 11, isValidCpf);

function hasOnlyOne<T>(values: T[]) {
  values.filter(Boolean);
  return values.length === 1;
}

export const zCustom = {
  string: {
    range: stringRange,
    date: stringDate,
    numeric: stringNumeric,
    registerNumber: stringRegisterNumber,

    ie: stringIe,
    cpf: stringCpf,
    cnpj: stringCnpj,
  },
  utils: {
    hasOnlyOne,
  },
};
