import { describe, expect, test } from "bun:test";
import { CertificateP12 } from "@/certificate";
import { signNfe } from ".";
import { NFE_TEST_DATA } from "@/dfe/nfe/layout/misc";
import { makeParser, makeBuilder } from "@/utils/xml";

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
      const signedNfe = signNfe(NFE_TEST_DATA, certificate);
      const signedNfeObject = makeParser().parse(signedNfe);

      expect(makeBuilder().build(signedNfeObject)).toEqual(signedNfe);
    });
  });
});
