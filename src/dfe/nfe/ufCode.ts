import type { UF } from "@/dfe/nfe/types";

// Mapeamento de siglas das UFs para os respectivos códigos numéricos IBGE
const ufCodeMap: Record<UF, number> = {
  AC: 12,
  AL: 27,
  AP: 16,
  AM: 13,
  BA: 29,
  CE: 23,
  DF: 53,
  ES: 32,
  GO: 52,
  MA: 21,
  MT: 51,
  MS: 50,
  MG: 31,
  PA: 15,
  PB: 25,
  PR: 41,
  PE: 26,
  PI: 22,
  RJ: 33,
  RN: 24,
  RS: 43,
  RO: 11,
  RR: 14,
  SC: 42,
  SP: 35,
  SE: 28,
  TO: 17,
};

// Retorna o código numérico de uma UF
export function getUfCode(uf: UF): number | undefined {
  return ufCodeMap[uf];
}

// Retorna a sigla de uma UF a partir do seu código numérico
export function getUfFromCode(code: number): UF | undefined {
  return Object.entries(ufCodeMap).find(
    ([, ufCode]) => ufCode === code,
  )?.[0] as UF;
}
