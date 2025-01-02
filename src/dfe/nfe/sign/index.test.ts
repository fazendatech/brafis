import { describe, expect, test } from "bun:test";

import { CertificateP12 } from "@/certificate";
import { makeBuilder } from "@/utils/xml";

import { signXml } from ".";

describe("signXml", async () => {
  const certificate = await CertificateP12.fromFilepath({
    filepath: "misc/sample-certificates/cert.pfx",
    password: "senha",
  });

  test("Signs XML", () => {
    const signId = "12345";
    const xml = makeBuilder().build({ testXml: { "@_Id": signId } });

    expect(signXml({ xml, signId, certificate })).toMatchSnapshot();
  });

  test("Throws error when sign ID is not found", () => {
    const signId = "12345";
    const invalidSignId = "123456";
    const xml = makeBuilder().build({ testXml: { "@_Id": signId } });

    expect(() =>
      signXml({ xml, signId: invalidSignId, certificate }),
    ).toThrowError(
      `the following xpath cannot be signed because it was not found: //*[@Id='${invalidSignId}']`,
    );
  });
});
