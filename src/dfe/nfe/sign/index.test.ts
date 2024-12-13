import { describe, expect, test } from "bun:test";
import { CertificateP12 } from "@/certificate";
import { signNfe } from ".";
import { NFE_TEST_DATA } from "@/dfe/nfe/layout/misc";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

describe("sign", () => {
  describe("signNfe", () => {
    test("Returns true when generate and sign the XML correctly", async () => {
      expect(
        signNfe(
          NFE_TEST_DATA,
          await CertificateP12.fromFilepath({
            filepath: "./misc/sample-certificates/cert.pfx",
            password: "senha",
          }),
        ),
      ).toMatchSnapshot();
    });

    test("É possível fazer o parse e build novamente da nfe assinada", async () => {
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

      const signedNfe = signNfe(
        NFE_TEST_DATA,
        await CertificateP12.fromFilepath({
          filepath: process.env.TEST_CERTIFICATE_PATH ?? "",
          password: process.env.TEST_CERTIFICATE_PASSWORD ?? "",
        }),
      );
      const signedNfeObject = parser.parse(signedNfe);
      expect(builder.build(signedNfeObject)).toEqual(signedNfe);
    });
  });
});
