import { describe, expect, test } from "bun:test";
import { CertificateP12 } from "@/certificate";
import { makeBuilder } from "@/utils/xml";

import { signXml } from ".";

describe("signXml", async () => {
  const certificate = await CertificateP12.fromFilepath({
    filepath: "misc/sample-certificates/cert.pfx",
    password: "senha",
  });
  const id = "12345";
  const xml = makeBuilder().build({ testXml: { "@_Id": id } });
  const xpath = `//*[@Id='${id}']`;

  test("Signs NFe XML correctly", () => {
    expect(signXml({ xml, sign: { xpath }, certificate })).toMatchSnapshot();
  });

  test("Signs NFe XML correctly with ID", () => {
    expect(signXml({ xml, sign: { id }, certificate })).toMatchSnapshot();
  });
});
