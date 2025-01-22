import { makeBuilder, makeParser } from "@/utils/xml";
import type { X2jOptions } from "fast-xml-parser";

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

export function parseSoap<Body>(
  xml: string,
  options?: { arrayTags?: string[] },
): Body | null {
  const { arrayTags } = options ?? {};

  const parserOptions: X2jOptions = {
    ignoreDeclaration: true,
    removeNSPrefix: true,
    parseTagValue: false,
  };
  if (arrayTags) {
    parserOptions.isArray = (tagName) => arrayTags.includes(tagName);
  }

  return makeParser(parserOptions).parse(xml).Envelope?.Body ?? null;
}
