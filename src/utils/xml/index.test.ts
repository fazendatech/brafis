import { describe, expect, test } from "bun:test";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { makeBuilder, makeParser } from ".";

describe("xml", () => {
  describe("parseXml", () => {
    test("Creates an XML Parser", () => {
      expect(makeParser()).toBeInstanceOf(XMLParser);
    });
  });

  describe("buildXml", () => {
    test("Creates an XML Builder", () => {
      expect(makeBuilder()).toBeInstanceOf(XMLBuilder);
    });
  });
});
