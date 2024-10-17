import type { CodStats, CStatsMap, InfoStats } from "./types.d.ts";

const successStatusMap: CStatsMap = {
  "107": "operando",
  "108": "paralisado-temporariamente",
  "109": "paralisado",
  "111": "uma-ocorrencia",
  "112": "multiplas-ocorrencias",
};

export function getInfoStatus(cStat?: CodStats): InfoStats {
  const status = successStatusMap[cStat ?? "000"];
  return status ?? "sem-sucesso";
}
