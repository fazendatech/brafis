import { describe, expect, test } from "bun:test";
import { CertificateP12 } from "@/certificate";
import { NFE_TEST_DATA } from "@/dfe/nfe/layout/misc";
import { signNfe } from ".";

describe("sign", () => {
  describe("signNfe", async () => {
    const certificate = await CertificateP12.fromFilepath({
      filepath: "misc/sample-certificates/cert.pfx",
      password: "senha",
    });

    test("Signs NFe XML correctly", () => {
      expect(signNfe(NFE_TEST_DATA, certificate)).toMatchSnapshot();
    });
  });
});
