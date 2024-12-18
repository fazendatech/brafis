import { makeBuilder, makeParser } from "@/utils/xml";

export function buildSoap<Body>(body: Body): string {
  return makeBuilder().build({
    "?xml": {
      "@_version": "1.0",
      "@_encoding": "UTF-8",
    },
    "soapenv:Envelope": {
      "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@_xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
      "@_xmlns:soapenv": "http://www.w3.org/2003/05/soap-envelope",
      "soapenv:Body": body,
    },
  });
}

export function parseSoap<Body>(xml: string): Body | null {
  return (
    makeParser({
      ignoreDeclaration: true,
      removeNSPrefix: true,
      parseTagValue: false,
    }).parse(xml).Envelope?.Body ?? null
  );
}
