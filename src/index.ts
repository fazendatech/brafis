// biome-ignore lint/performance/noBarrelFile:
export { CertificateP12 } from "@/certificate";
export {
  InvalidPfxError,
  InvalidPasswordError,
  NoPrivateKeyFoundError,
  NoCertificatesFoundError,
  CertificateExpiredError,
} from "@/certificate/errors";
export type {
  CertificateP12Options,
  PemPayload,
  P12Payload,
  CertificateFields,
  CertificateP12AsPemOptions,
} from "@/certificate/types";
export { signXml, type signXmlOptions } from "@/certificate/sign";

export { NfeWebServices } from "@/dfe/nfe/webServices";
export { NfeServiceRequestError } from "@/dfe/nfe/webServices/errors";
export type { NfeWebServicesOptions } from "@/dfe/nfe/webServices/types";

export { getWebServiceUrl } from "@/dfe/nfe/webServiceUrls";
export { NfeWebServiceNotFoundError } from "@/dfe/nfe/webServiceUrls/errors";
export type { GetWebServiceUrlOptions } from "@/dfe/nfe/webServiceUrls/types";

export { getUfCode, getUfFromCode } from "@/ufCode";
export type { Uf, UfCode } from "@/ufCode/types";

export { makeParser, makeBuilder } from "@/utils/xml";

export { TimeoutError } from "@/utils/errors";
