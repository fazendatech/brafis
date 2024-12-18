import { describe, expect, test } from "bun:test";
import { makeBuilder, makeParser } from ".";

describe("xml", () => {
  describe("parseXml", () => {
    test("Analisa XML corretamente", () => {
      const xml = `<root><child name="foo">bar</child></root>`;
      const expectedObject = {
        root: {
          child: {
            "@_name": "foo",
            "#text": "bar",
          },
        },
      };
      expect(makeParser().parse(xml)).toEqual(expectedObject);
    });
  });

  describe("buildXml", () => {
    test("Constrói XML corretamente", () => {
      const object = {
        root: {
          child: {
            "@_name": "foo",
            "#text": "bar",
          },
        },
      };
      const expectedXml = `<root><child name="foo">bar</child></root>`;
      expect(makeBuilder().build(object)).toEqual(expectedXml);
    });
  });
});
