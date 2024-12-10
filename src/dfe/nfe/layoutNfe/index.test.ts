import { describe, expect, test } from "bun:test";
import { CertificateP12 } from "@/certificate";
import { signNfe } from ".";
import { schemaNfeInfNfe, type NfeInfNfe } from "./groupA";
import { schemaNfeIde } from "./groupB";
import { schemaNfeNfRef } from "./groupBA";
import { schemaNfeEmit } from "./groupC";
import { schemaNfeAvulsa } from "./groupD";
import { schemaNfeDest } from "./groupE";
import { schemaNfeRetirada } from "./groupF";
import { schemaNfeEntrega } from "./groupG";
import { schemaNfeAutXml } from "./groupGA";
import { schemaNfeDet } from "./groupH";
import { schemaNfeProd } from "./groupI";
import { schemaNfeDi } from "./groupI01";
import { schemaNfeDetExport } from "./groupI03";
import { schemaNfeRastro } from "./groupI80";
import { schemaNfeImposto } from "./groupM";
import { schemaNfeIcms } from "./groupN01";
import { schemaNfeTotal } from "./groupW";
import { schemaNfeIssqnTot } from "./groupW01";
import { schemaNfeRetTrib } from "./groupW02";
import { schemaNfeTransp } from "./groupX";
import { schemaNfeCobr } from "./groupY";
import { schemaNfePag } from "./groupYA";
import { schemaNfeInfIntermed } from "./groupYB";
import { schemaNfeInfAdic } from "./groupZ";
import { schemaNfeInfRespTec } from "./groupZD";

describe("layouteNfe", () => {
  const validNfe: NfeInfNfe = {
    "@_versao": "4.00",
    "@_Id": "NFe12345678901234567890123456789012345678901235",
    ide: {
      cUF: "35",
      cNF: "00012345",
      natOp: "Venda",
      mod: "55",
      serie: "001",
      nNF: "123456",
      dhEmi: "2024-12-06T08:00:00Z",
      tpNF: "1",
      idDest: "1",
      cMunFG: "3550308",
      tpImp: "1",
      tpEmis: "1",
      cDV: "4",
      tpAmb: "1",
      finNFe: "1",
      indFinal: "1",
      indPres: "1",
      procEmi: "0",
      verProc: "1.0.0",
    },
    emit: {
      CNPJ: "12345678000195",
      xNome: "Empresa Emitente LTDA",
      xFant: "Fantasia Emitente",
      enderEmit: {
        xLgr: "Rua Exemplo",
        nro: "123",
        xBairro: "Bairro Exemplo",
        cMun: "3550308",
        xMun: "São Paulo",
        UF: "SP",
        CEP: "01001000",
      },
      IE: "1234567890",
      CRT: "3",
    },
    dest: {
      CPF: "11155599900",
      xNome: "Destinatário Exemplo",
      enderDest: {
        xLgr: "Avenida Exemplo",
        nro: "456",
        xBairro: "Outro Bairro",
        cMun: "3304557",
        xMun: "Rio de Janeiro",
        UF: "RJ",
        CEP: "20040030",
      },
      indIEDest: "9",
    },
    det: [
      {
        nItem: "1",
        prod: {
          cProd: "001",
          cEAN: "SEM GTIN",
          xProd: "Produto Exemplo",
          NCM: "12345678",
          CFOP: "5102",
          uCom: "UN",
          qCom: "10.0000",
          vUnCom: "50.0000000000",
          vProd: "500.00",
          uTrib: "UN",
          qTrib: "10.0000",
          vUnTrib: "50.0000000000",
          indTot: "1",
        },
        imposto: {
          ICMS: {
            ICMS00: {
              orig: "0",
              CST: "00",
              modBC: "3",
              vBC: "500.00",
              pICMS: "18.00",
              vICMS: "90.00",
            },
          },
        },
      },
    ],
    total: {
      ICMSTot: {
        vBC: "500.00",
        vICMS: "90.00",
        vICMSDeson: "0.00",
        vFCP: "0.00",
        vBCST: "0.00",
        vST: "0.00",
        vFCPST: "0.00",
        vFCPSTRet: "0.00",
        vProd: "500.00",
        vFrete: "0.00",
        vSeg: "0.00",
        vDesc: "0.00",
        vII: "0.00",
        vIPI: "0.00",
        vIPIDevol: "0.00",
        vPIS: "0.00",
        vCOFINS: "0.00",
        vOutro: "0.00",
        vNF: "500.00",
      },
      ISSQNtot: {
        vServ: "0.00",
        vBC: "0.00",
        vISS: "0.00",
        vPIS: "0.00",
        vCOFINS: "0.00",
        dCompet: "2024-12-06",
        vDeducao: "0.00",
        vOutro: "0.00",
        vDescIncond: "0.00",
        vDescCond: "0.00",
        vISSRet: "0.00",
        cRegTrib: "5",
      },
      retTrib: {
        vRetPIS: "0.00",
        vRetCOFINS: "0.00",
        vRetCSLL: "0.00",
        vBCIRRF: "0.00",
        vIRRF: "0.00",
        vBCRetPrev: "0.00",
        vRetPrev: "0.00",
      },
    },
    transp: {
      modFrete: "1",
    },
    pag: {
      detPag: [
        {
          tPag: "01",
          vPag: "500.00",
        },
      ],
    },
    cobr: {
      dup: [
        {
          vDup: "500.00",
        },
      ],
    },
    infIntermed: {
      CNPJ: "00023456000177",
      idCadIntTran:
        "123456789012345678901234567890123456789012345678901234567890",
    },
    infAdic: {},
    infRespTec: {
      CNPJ: "12345678000195",
      xContato: "Responsável Técnico",
      email: "responsavel@empresa.com",
      fone: "11999999999",
    },
  };

  describe("zod schemas", () => {
    describe("groupA", () => {
      test("Returns true for a valid infNfe schema", () => {
        expect(schemaNfeInfNfe.safeParse(validNfe).error).toBeFalsy();
      });
    });
    describe("groupB", () => {
      test("Returns true for a valid ide schema", () => {
        expect(schemaNfeIde.safeParse(validNfe.ide).error).toBeFalsy();
      });
    });
    describe("groupBA", () => {
      test("Returns true for a valid NFref schema", () => {
        expect(schemaNfeNfRef.safeParse(validNfe.ide.NFref).error).toBeFalsy();
      });
    });
    describe("groupC", () => {
      test("Returns true for a valid emit schema", () => {
        expect(schemaNfeEmit.safeParse(validNfe.emit).error).toBeFalsy();
      });
    });
    describe("groupD", () => {
      test("Returns true for a valid avulsa schema", () => {
        expect(schemaNfeAvulsa.safeParse(validNfe.avulsa).error).toBeFalsy();
      });
    });
    describe("groupE", () => {
      test("Returns true for a valid dest schema", () => {
        expect(schemaNfeDest.safeParse(validNfe.dest).error).toBeFalsy();
      });
    });
    describe("groupF", () => {
      test("Returns true for a valid retirada schema", () => {
        expect(
          schemaNfeRetirada.safeParse(validNfe.retirada).error,
        ).toBeFalsy();
      });
    });
    describe("groupG", () => {
      test("Returns true for a valid entrega schema", () => {
        expect(schemaNfeEntrega.safeParse(validNfe.entrega).error).toBeFalsy();
      });
    });
    describe("groupGA", () => {
      test("Returns true for a valid autXML schema", () => {
        expect(schemaNfeAutXml.safeParse(validNfe.autXML).error).toBeFalsy();
      });
    });
    describe("groupH", () => {
      test("Returns true for a valid det schema", () => {
        expect(schemaNfeDet.safeParse(validNfe.det).error).toBeFalsy();
      });
    });
    describe("groupI", () => {
      test("Returns true for a valid prod schema", () => {
        expect(schemaNfeProd.safeParse(validNfe.det[0].prod).error).toBeFalsy();
      });
    });
    describe("groupI01", () => {
      test("Returns true for a valid DI schema", () => {
        expect(
          schemaNfeDi.safeParse(validNfe.det[0].prod.DI).error,
        ).toBeFalsy();
      });
    });
    describe("groupI03", () => {
      test("Returns true for a valid detExport schema", () => {
        expect(
          schemaNfeDetExport.safeParse(validNfe.det[0].prod.detExport).error,
        ).toBeFalsy();
      });
    });
    describe("groupI80", () => {
      test("Returns true for a valid rastro schema", () => {
        expect(
          schemaNfeRastro.safeParse(validNfe.det[0].prod.rastro).error,
        ).toBeFalsy();
      });
    });
    describe("groupM", () => {
      test("Returns true for a valid imposto schema", () => {
        expect(
          schemaNfeImposto.safeParse(validNfe.det[0].imposto).error,
        ).toBeFalsy();
      });
    });
    describe("groupN01", () => {
      test("Returns true for a valid ICMS schema", () => {
        expect(
          schemaNfeIcms.safeParse(validNfe.det[0].imposto.ICMS).error,
        ).toBeFalsy();
      });
    });
    describe("groupW", () => {
      test("Returns true for a valid total schema", () => {
        expect(schemaNfeTotal.safeParse(validNfe.total).error).toBeFalsy();
      });
    });
    describe("groupW01", () => {
      test("Returns true for a valid ISSQNtotTot schema", () => {
        expect(
          schemaNfeIssqnTot.safeParse(validNfe.total.ISSQNtot).error,
        ).toBeFalsy();
      });
    });
    describe("groupW02", () => {
      test("Returns true for a valid retTrib schema", () => {
        expect(
          schemaNfeRetTrib.safeParse(validNfe.total.retTrib).error,
        ).toBeFalsy();
      });
    });
    describe("groupX", () => {
      test("Returns true for a valid transp schema", () => {
        expect(schemaNfeTransp.safeParse(validNfe.transp).error).toBeFalsy();
      });
    });
    describe("groupY", () => {
      test("Returns true for a valid cobr schema", () => {
        expect(schemaNfeCobr.safeParse(validNfe.cobr).error).toBeFalsy();
      });
    });
    describe("groupYA", () => {
      test("Returns true for a valid pag schema", () => {
        expect(schemaNfePag.safeParse(validNfe.pag).error).toBeFalsy();
      });
    });
    describe("groupYB", () => {
      test("Returns true for a valid infIntermed schema", () => {
        expect(
          schemaNfeInfIntermed.safeParse(validNfe.infIntermed).error,
        ).toBeFalsy();
      });
    });
    describe("groupZ", () => {
      test("Returns true for a valid infAdic schema", () => {
        expect(schemaNfeInfAdic.safeParse(validNfe.infAdic).error).toBeFalsy();
      });
    });
    describe("groupZD", () => {
      test("Returns true for a valid groupZD schema", () => {
        expect(
          schemaNfeInfRespTec.safeParse(validNfe.infRespTec).error,
        ).toBeFalsy();
      });
    });
  });

  describe("generateAndSignNfe", async () => {
    const { cert, key } = (
      await CertificateP12.fromFilepath({
        filepath: process.env.TEST_CERTIFICATE_PATH ?? "",
        password: process.env.TEST_CERTIFICATE_PASSWORD ?? "",
      })
    ).asPem();

    const signRegex =
      /<Signature xmlns="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#">[\s\S]*?<SignedInfo>[\s\S]*?<CanonicalizationMethod Algorithm="http:\/\/www\.w3\.org\/TR\/2001\/REC-xml-c14n-20010315"\/>[\s\S]*?<SignatureMethod Algorithm="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#rsa-sha1"\/>[\s\S]*?<Reference URI="#NFe[\w\d]+">[\s\S]*?<Transforms>[\s\S]*?<Transform Algorithm="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#enveloped-signature"\/>[\s\S]*?<Transform Algorithm="http:\/\/www\.w3\.org\/TR\/2001\/REC-xml-c14n-20010315"\/>[\s\S]*?<\/Transforms>[\s\S]*?<DigestMethod Algorithm="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#sha1"\/>[\s\S]*?<DigestValue>[\w\+\/=]+<\/DigestValue>[\s\S]*?<\/Reference>[\s\S]*?<\/SignedInfo>[\s\S]*?<SignatureValue>[\w\+\/=]+<\/SignatureValue>[\s\S]*?<KeyInfo>[\s\S]*?<X509Data>[\s\S]*?<X509Certificate>[\w\+\/=]+<\/X509Certificate>[\s\S]*?<\/X509Data>[\s\S]*?<\/KeyInfo>[\s\S]*?<\/Signature>/;

    test.todo(
      "Returns true when generate and sign the XML correctly",
      async () => {
        const signedXML = await signNfe(validNfe, {
          privateKey: key,
          publicCert: cert,
        });
        console.log(signedXML.Nfe);
        expect(signRegex.test(signedXML.Nfe)).toBeTrue();
      },
    );
  });
});
