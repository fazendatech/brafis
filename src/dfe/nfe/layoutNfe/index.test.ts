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
      cDV: "5",
      tpAmb: "1",
      finNFe: "1",
      indFinal: "1",
      indPres: "1",
      procEmi: "0",
      verProc: "1.0.0",
      NFref: [
        {
          refNFe: "12345678901234567890123456789012345678901234",
        },
        {
          refNF: {
            cUF: "35",
            AAMM: "2412",
            CNPJ: "12345678000195",
            mod: "01",
            serie: "001",
            nNF: "123456",
          },
        },
        {
          refNFP: {
            cUF: "35",
            AAMM: "2412",
            CPF: "11155599900",
            IE: "1234567890",
            mod: "04",
            serie: "001",
            nNF: "123456",
          },
        },
        {
          refCTe: "12345678901234567890123456789012345678901234",
        },
        {
          refECF: {
            mod: "2B",
            nECF: "123",
            nCOO: "123456",
          },
        },
      ],
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
    avulsa: {
      CNPJ: "12345678000195",
      xOrgao: "Secretaria da Fazenda",
      matr: "123456789",
      xAgente: "Agente da Fazenda",
      fone: "11999999999",
      UF: "SP",
      nDAR: "123456789012345678901234567890123456789012345678901234567890",
      dEmi: "2024-12-06",
      vDAR: "500.00",
      repEmi: "0",
      dPag: "2024-12-06",
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
    retirada: {
      CNPJ: "12345678000195",
      xLgr: "Rua Exemplo",
      nro: "123",
      xBairro: "Bairro Exemplo",
      cMun: "3550308",
      xMun: "São Paulo",
      UF: "SP",
    },
    entrega: {
      CNPJ: "12345678000195",
      xLgr: "Rua Exemplo",
      nro: "123",
      xBairro: "Bairro Exemplo",
      cMun: "3550308",
      xMun: "São Paulo",
      UF: "SP",
    },
    autXML: [
      {
        CNPJ: "12345678000195",
      },
    ],
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
          DI: [
            {
              nDI: "123456",
              dDI: "2024-12-06",
              xLocDesemb: "Local Desembaraço",
              UFDesemb: "SP",
              dDesemb: "2024-12-06",
              cExportador: "123456789",
              adi: [
                {
                  nAdicao: "1",
                  nSeqAdic: "1",
                  cFabricante: "123456789",
                  vDescDI: "0.00",
                  nDraw: "12345678901",
                },
              ],
              tpViaTransp: "7",
              tpIntermedio: "1",
            },
          ],
          detExport: [
            {
              nDraw: "12345678901",
              exportInd: {
                nRE: "123456789012",
                chNFe: "12345678901212345678901234567890123456789012",
                qExport: "10.000",
              },
            },
          ],
          rastro: [
            {
              nLote: "1",
              qLote: "10.000",
              dFab: "2024-12-06",
              dVal: "2024-12-06",
              cAgreg: "123456789",
            },
          ],
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
      const parse = schemaNfeInfNfe.safeParse(validNfe);
      test("Returns success for a valid infNfe schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid infNfe schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupB", () => {
      const parse = schemaNfeIde.safeParse(validNfe.ide);
      test("Returns success for a valid ide schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid ide schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupBA", () => {
      for (const NFref of validNfe.ide.NFref ?? []) {
        const parse = schemaNfeNfRef.safeParse(NFref);
        test("Returns success for a valid NFref schema", () => {
          expect(parse.success).toBeTrue();
        });
        test("Returns no error for a valid NFref schema", () => {
          expect(parse.error).toBeFalsy();
        });
      }
    });
    describe("groupC", () => {
      const parse = schemaNfeEmit.safeParse(validNfe.emit);
      test("Returns success for a valid emit schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid emit schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupD", () => {
      const parse = schemaNfeAvulsa.safeParse(validNfe.avulsa);
      test("Returns success for a valid avulsa schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid avulsa schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupE", () => {
      const parse = schemaNfeDest.safeParse(validNfe.dest);
      test("Returns success for a valid dest schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid dest schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupF", () => {
      const parse = schemaNfeRetirada.safeParse(validNfe.retirada);
      test("Returns success for a valid retirada schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid retirada schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupG", () => {
      const parse = schemaNfeEntrega.safeParse(validNfe.entrega);
      test("Returns success for a valid entrega schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid entrega schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupGA", () => {
      for (const autXML of validNfe.autXML ?? []) {
        const parse = schemaNfeAutXml.safeParse(autXML);
        test("Returns success for a valid autXML schema", () => {
          expect(parse.success).toBeTrue();
        });
        test("Returns no error for a valid autXML schema", () => {
          expect(parse.error).toBeFalsy();
        });
      }
    });
    describe("groupH", () => {
      for (const det of validNfe.det) {
        const parse = schemaNfeDet.safeParse(det);
        test("Returns success for a valid det schema", () => {
          expect(parse.success).toBeTrue();
        });
        test("Returns no error for a valid det schema", () => {
          expect(parse.error).toBeFalsy();
        });
      }
    });
    describe("groupI", () => {
      for (const det of validNfe.det) {
        const parse = schemaNfeProd.safeParse(det.prod);
        test("Returns success for a valid prod schema", () => {
          expect(parse.success).toBeTrue();
        });
        test("Returns no error for a valid prod schema", () => {
          expect(parse.error).toBeFalsy();
        });
      }
    });
    describe("groupI01", () => {
      for (const det of validNfe.det) {
        for (const DI of det.prod.DI ?? []) {
          const parse = schemaNfeDi.safeParse(DI);
          test("Returns success for a valid DI schema", () => {
            expect(parse.success).toBeTrue();
          });
          test("Returns no error for a valid DI schema", () => {
            expect(parse.error).toBeFalsy();
          });
        }
      }
    });
    describe("groupI03", () => {
      for (const det of validNfe.det) {
        for (const detExport of det.prod.detExport ?? []) {
          const parse = schemaNfeDetExport.safeParse(detExport);
          test("Returns success for a valid detExport schema", () => {
            expect(parse.success).toBeTrue();
          });
          test("Returns no error for a valid detExport schema", () => {
            expect(parse.error).toBeFalsy();
          });
        }
      }
    });
    describe("groupI80", () => {
      for (const det of validNfe.det) {
        for (const rastro of det.prod.rastro ?? []) {
          const parse = schemaNfeRastro.safeParse(rastro);
          test("Returns success for a valid rastro schema", () => {
            expect(parse.success).toBeTrue();
          });
          test("Returns no error for a valid rastro schema", () => {
            expect(parse.error).toBeFalsy();
          });
        }
      }
    });
    describe("groupM", () => {
      for (const det of validNfe.det) {
        const parse = schemaNfeImposto.safeParse(det.imposto);
        test("Returns success for a valid imposto schema", () => {
          expect(parse.success).toBeTrue();
        });
        test("Returns no error for a valid imposto schema", () => {
          expect(parse.error).toBeFalsy();
        });
      }
    });
    describe("groupN01", () => {
      for (const det of validNfe.det) {
        const parse = schemaNfeIcms.safeParse(det.imposto.ICMS);
        test("Returns success for a valid ICMS schema", () => {
          expect(parse.success).toBeTrue();
        });
        test("Returns no error for a valid ICMS schema", () => {
          expect(parse.error).toBeFalsy();
        });
      }
    });
    describe("groupW", () => {
      const parse = schemaNfeTotal.safeParse(validNfe.total);
      test("Returns success for a valid total schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid total schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupW01", () => {
      const parse = schemaNfeIssqnTot.safeParse(validNfe.total.ISSQNtot);
      test("Returns success for a valid ISSQNtot schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid ISSQNtot schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupW02", () => {
      const parse = schemaNfeRetTrib.safeParse(validNfe.total.retTrib);
      test("Returns success for a valid retTrib schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid retTrib schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupX", () => {
      const parse = schemaNfeTransp.safeParse(validNfe.transp);
      test("Returns success for a valid transp schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid transp schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupY", () => {
      const parse = schemaNfeCobr.safeParse(validNfe.cobr);
      test("Returns success for a valid cobr schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid cobr schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupYA", () => {
      const parse = schemaNfePag.safeParse(validNfe.pag);
      test("Returns success for a valid pag schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid pag schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupYB", () => {
      const parse = schemaNfeInfIntermed.safeParse(validNfe.infIntermed);
      test("Returns success for a valid infIntermed schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid infIntermed schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupZ", () => {
      const parse = schemaNfeInfAdic.safeParse(validNfe.infAdic);
      test("Returns success for a valid infAdic schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid infAdic schema", () => {
        expect(parse.error).toBeFalsy();
      });
    });
    describe("groupZD", () => {
      const parse = schemaNfeInfRespTec.safeParse(validNfe.infRespTec);
      test("Returns success for a valid groupZD schema", () => {
        expect(parse.success).toBeTrue();
      });
      test("Returns no error for a valid groupZD schema", () => {
        expect(parse.error).toBeFalsy();
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

    test("Returns true when generate and sign the XML correctly", async () => {
      const signedXML = await signNfe(validNfe, {
        privateKey: key,
        publicCert: cert,
      });
      expect(signRegex.test(signedXML)).toBeTrue();
    });
  });
});
