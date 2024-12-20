import { describe, expect, test } from "bun:test";
import { makeBuilder, makeParser } from ".";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

describe("xml", () => {
  describe("parseXml", () => {
    test("Successfully creates an XML Parser", () => {
      expect(makeParser()).toBeInstanceOf(XMLParser);
    });
  });

  describe("buildXml", () => {
    test("Successfully creates an XML Builder", () => {
      expect(makeBuilder()).toBeInstanceOf(XMLBuilder);
    });
  });
});