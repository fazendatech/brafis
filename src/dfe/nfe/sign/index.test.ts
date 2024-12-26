import { describe, expect, test } from "bun:test";
import { CertificateP12 } from "@/certificate";
import { signXml } from ".";
import { NFE_TEST_DATA } from "@/dfe/nfe/layout/misc";
import { makeParser, makeBuilder } from "@/utils/xml";

describe("sign", () => {
  describe("signNfe", async () => {
    const certificate = await CertificateP12.fromFilepath({
      filepath: process.env.TEST_CERTIFICATE_PATH ?? "",
      password: process.env.TEST_CERTIFICATE_PASSWORD ?? "",
    });
    const xml = makeBuilder().build(NFE_TEST_DATA);
    const id = NFE_TEST_DATA.NFe.infNFe["@_Id"];
    const xpath = `//*[@Id='${id}']`;

    test("Signs NFe XML correctly", () => {
      expect(signXml({ xml, xpath, certificate })).toMatchSnapshot();
    });

    test("Signs NFe XML correctly with ID", () => {
      expect(signXml({ xml, id, certificate })).toMatchSnapshot();
    });

    test("Parses and rebuilds signed NFe correctly", () => {
      const signedNfe = signXml({ xml, xpath, certificate });
      const signedNfeObject = makeParser().parse(signedNfe);

      expect(makeBuilder().build(signedNfeObject)).toEqual(signedNfe);
    });
  });
});
