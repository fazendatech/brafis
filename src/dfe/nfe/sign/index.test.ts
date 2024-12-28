import { describe, expect, test } from "bun:test";

import { CertificateP12 } from "@/certificate";
import { NFE_TEST_DATA } from "@/dfe/nfe/layout/misc";
import { makeBuilder } from "@/utils/xml";

import { signXml } from ".";

describe("sign", () => {
  describe("signNfe", async () => {
    const certificate = await CertificateP12.fromFilepath({
      filepath: process.env.TEST_CERTIFICATE_PATH ?? "",
      password: process.env.TEST_CERTIFICATE_PASSWORD ?? "",
    });
    const xml = makeBuilder().build(NFE_TEST_DATA);
    const signId = NFE_TEST_DATA.NFe.infNFe["@_Id"];

    test("Signs NFe XML correctly", () => {
      expect(signXml({ xml, signId, certificate })).toMatchSnapshot();
    });
  });
});
