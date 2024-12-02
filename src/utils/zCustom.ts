import { z } from "zod";

import { isValidCnpj } from "@/utils/validators/isValidCnpj";
import { isValidCpf } from "@/utils/validators/isValidCpf";
import { isValidIe } from "@/utils/validators/isValidIe";

const length = (min: number, max: number) => z.string().min(min).max(max);
const numeric = () => z.string().regex(/^\d+$/, "Deve possuir apenas dígitos.");
const decimal = (before: number, after: number) =>
  z
    .string()
    .regex(
      new RegExp(`^\\d{1,${before}}(\\.\\d{1,${after}})?$`),
      "Use apenas números decimais separados por ponto",
    );
const date = () => z.string().datetime({ precision: 0 });
const ie = () => z.string().refine((value) => isValidIe(value));
const cnpj = () => z.string().refine((value) => isValidCnpj(value));
const cpf = () => z.string().refine((value) => isValidCpf(value));
const phone = () => numeric().min(6).max(14);
const placa = () =>
  z.string().regex(/^[a-zA-Z]{2,4}[0-9]{3,4}$/, {
    message: "Formatos de placas válidas: XXX9999, XXX999, XX9999, or XXXX999.",
  });

function hasOnlyOne(...values: unknown[]) {
  const filtered = values.filter((v) => !!v);
  return filtered.length === 1;
}

function hasAllOrNothing(...values: unknown[]) {
  const len = values.length;
  const filtered = values.filter((v) => !!v);
  return filtered.length === len || filtered.length === 0;
}

export const zCustom = {
  length,
  date,
  numeric,
  decimal,
  ie,
  cpf,
  cnpj,
  phone,
  placa,
  utils: {
    hasOnlyOne,
    hasAllOrNothing,
  },
};
