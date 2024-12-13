import { describe, expect, test } from "bun:test";
import { CertificateP12 } from "@/certificate";
import { signNfe } from ".";
import { NFE_TEST_DATA } from "@/dfe/nfe/layout/misc";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

describe("sign", () => {
  describe("signNfe", async () => {
    const certificate = await CertificateP12.fromFilepath({
      filepath: "misc/sample-certificates/cert.pfx",
      password: "senha",
    });

    test("Signs NFe XML correctly", () => {
      expect(signNfe(NFE_TEST_DATA, certificate)).toMatchSnapshot();
    });

    test("Parses and rebuilds signed NFe correctly", () => {
      const parser = new XMLParser({
        parseTagValue: false,
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      });
      const builder = new XMLBuilder({
        attributeNamePrefix: "@_",
        suppressEmptyNode: true,
        ignoreAttributes: false,
      });

      const signedNfe = signNfe(NFE_TEST_DATA, certificate);
      const signedNfeObject = parser.parse(signedNfe);

      expect(builder.build(signedNfeObject)).toEqual(signedNfe);
    });
  });
});
