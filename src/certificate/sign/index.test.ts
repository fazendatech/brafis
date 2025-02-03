import { describe, expect, test } from "bun:test";
import { CertificateP12 } from "@/certificate";
import { signXml } from ".";

describe("signXml", async () => {
  const certificate = await CertificateP12.fromFilepath({
    filepath: "misc/sample-certificates/cert.pfx",
    password: "senha",
  });

  test("Signs XML", () => {
    const signId = "12345";
    const xmlObject = { root: { toSign: { "@_Id": signId } } };

    expect(signXml({ xmlObject, signId, certificate })).toMatchSnapshot();
  });

  test("Throws error when sign ID is not found", () => {
    const signId = "12345";
    const invalidSignId = "123456";
    const xmlObject = { root: { toSign: { "@_Id": signId } } };

    expect(() =>
      signXml({ xmlObject, signId: invalidSignId, certificate }),
    ).toThrowError(
      `the following xpath cannot be signed because it was not found: //*[@Id='${invalidSignId}']`,
    );
  });
});
