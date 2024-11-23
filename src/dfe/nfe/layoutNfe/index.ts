import { z } from "zod";

import { ufCodeMap } from "@/ufCode";
import type { UF, UFCode } from "@/ufCode/types";

// NOTE: Hack pro zod aceitar tipos customizados (https://stackoverflow.com/a/73825370)
const ufCodeList = Object.keys(ufCodeMap);
const ufCodes: [UFCode, ...UFCode[]] = [ufCodeList[0], ...ufCodeList];
export const zUfCode = () => z.enum(ufCodes);

const ufList = Object.values(ufCodeMap);
const ufs: [UF, ...UF[]] = [ufList[0], ...ufList];
export const zUf = () => z.enum(ufs);

export const invalidCnfs = new Set([
  "00000000",
  "11111111",
  "22222222",
  "33333333",
  "44444444",
  "55555555",
  "66666666",
  "77777777",
  "88888888",
  "99999999",
  "12345678",
  "23456789",
  "34567890",
  "45678901",
  "56789012",
  "67890123",
  "78901234",
  "89012345",
  "90123456",
  "01234567",
]);

export function verifierDigit(digits: string): number {
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

export function formatYYMM(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year.toString().slice(-2)}${month.toString().padStart(2, "0")}`;
}

export function buildNfeAccessCode({
  cpfCnpj,
  serie,
  number,
  code,
  cUF,
  mod,
  tpEmis,
  dhEmis,
}: {
  cpfCnpj: string;
  serie: string;
  number: number;
  code: string;
  cUF: string;
  mod: string;
  tpEmis: string;
  dhEmis: Date;
}): { accessCode: string; dv: string; code: string } {
  const accessCode = `${cUF}${formatYYMM(dhEmis)}${cpfCnpj.padStart(
    14,
    "0",
  )}${mod}${serie.padStart(
    3,
    "0",
  )}${number.toString().padStart(9, "0")}${tpEmis}${code}`;
  const dv = verifierDigit(code);
  return { accessCode, dv: dv.toString(), code };
}
