import { XMLBuilder, XMLParser } from "fast-xml-parser";

export function buildSoap<Body>(body: Body): string {
  const xmlBuilder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  return xmlBuilder.build({
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

export function parseSoap<Body>(xml: string): Body {
  const xmlParser = new XMLParser({
    ignoreDeclaration: true,
    removeNSPrefix: true,
    parseTagValue: false,
  });
  const parsed = xmlParser.parse(xml);
  return parsed.Envelope?.Body;
}
