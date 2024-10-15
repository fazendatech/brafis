import { XMLBuilder, XMLParser } from "fast-xml-parser";

// function soapEnvelope<Obj>(obj: Obj): Obj {}

export function build<Obj>(obj: Obj): string {
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
      "soapenv:Body": {
        nfeDadosMsg: {
          ...obj,
        },
      },
    },
  });
}

export function parse<Obj>(xml: string): Obj {
  const xmlParser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
  });
  return xmlParser.parse(xml).Envelope.Body;
}
