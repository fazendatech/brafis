import {
  XMLParser,
  XMLBuilder,
  type X2jOptions,
  type XmlBuilderOptions,
} from "fast-xml-parser";

export function makeParser(options?: X2jOptions): XMLParser {
  return new XMLParser({
    parseTagValue: false,
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    ...options,
  });
}

export function makeBuilder(options?: XmlBuilderOptions): XMLBuilder {
  return new XMLBuilder({
    attributeNamePrefix: "@_",
    suppressEmptyNode: true,
    ignoreAttributes: false,
    ...options,
  });
}
