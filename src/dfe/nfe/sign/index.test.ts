import { describe, expect, test } from "bun:test";
import { CertificateP12 } from "@/certificate";
import { NFE_TEST_DATA } from "@/dfe/nfe/layout/misc";
import { signNfe } from ".";

describe("sign", () => {
  describe("signNfe", async () => {
    const certificate = await CertificateP12.fromFilepath({
      filepath: process.env.TEST_CERTIFICATE_PATH ?? "",
      password: process.env.TEST_CERTIFICATE_PASSWORD ?? "",
    });

    test("Signs NFe XML correctly", () => {
      expect(signNfe(NFE_TEST_DATA, certificate)).toMatchSnapshot();
    });
  });
});
