import { describe, expect, test } from "bun:test";

import { CertificateP12 } from "@/certificate";
import { makeBuilder } from "@/utils/xml";

import { signXml } from ".";

describe("signXml", async () => {
  const certificate = await CertificateP12.fromFilepath({
    filepath: "misc/sample-certificates/cert.pfx",
    password: "senha",
  });
  const signId = "12345";
  const xml = makeBuilder().build({ testXml: { "@_Id": signId } });

  test("Signs XML", () => {
    expect(signXml({ xml, signId, certificate })).toMatchSnapshot();
  });
});
