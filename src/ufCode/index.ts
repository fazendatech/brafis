import type { Uf, UfCode } from "./types";

export const ufCodeMap: Record<Uf, UfCode> = {
  AC: "12",
  AL: "27",
  AP: "16",
  AM: "13",
  BA: "29",
  CE: "23",
  DF: "53",
  ES: "32",
  GO: "52",
  MA: "21",
  MT: "51",
  MS: "50",
  MG: "31",
  PA: "15",
  PB: "25",
  PR: "41",
  PE: "26",
  PI: "22",
  RJ: "33",
  RN: "24",
  RS: "43",
  RO: "11",
  RR: "14",
  SC: "42",
  SP: "35",
  SE: "28",
  TO: "17",
};

export const ufCodeMapInverse = Object.fromEntries(
  Object.entries(ufCodeMap).map(([uf, code]) => [code, uf]),
) as Record<UfCode, Uf>;

/**
 * @description Retorna o código numérico de uma UF.
 * Exemplo:
 *
 * ```ts
 * getUfCode("SP") // "35"
 * ```
 *
 * @param {Uf} uf - Sigla de uma UF.
 *
 * @returns {UfCode} Código numérico de uma UF.
 */
export function getUfCode(uf: Uf): UfCode {
  return ufCodeMap[uf];
}

/**
 * @description Retorna a sigla de uma UF a partir do seu código numérico.
 * Exemplo:
 *
 * ```ts
 * getUfFromCode("35") // "SP"
 * ```
 *
 * @param {UfCode} code - Código numérico de uma UF.
 *
 * @returns {Uf} Sigla de uma UF.
 */
export function getUfFromCode(code: UfCode): Uf {
  return ufCodeMapInverse[code];
}
