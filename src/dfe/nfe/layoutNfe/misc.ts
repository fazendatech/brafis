import { z } from "zod";
import { ufCodeMap } from "@/ufCode";
import type { UF, UFCode } from "@/ufCode/types";

// NOTE: Hack pro zod aceitar tipos customizados (https://stackoverflow.com/a/73825370)
const ufCodeList = Object.values(ufCodeMap);
const ufCodes: [UFCode, ...UFCode[]] = [ufCodeList[0], ...ufCodeList];
export const zUfCode = () => z.enum(ufCodes);

const ufList = Object.keys(ufCodeMap);
const ufs: [UF, ...UF[]] = [ufList[0], ...ufList];
export const zUf = () => z.enum(ufs);
