import { describe, expect, test } from "bun:test";
import { CertificateP12 } from "@/certificate";
import { signNfe } from ".";
import type { NfeInfNfe } from "./groupA";

describe("generateAndSignNfe", async () => {
  const { cert, key } = (
    await CertificateP12.fromFilepath({
      filepath: process.env.TEST_CERTIFICATE_PATH ?? "",
      password: process.env.TEST_CERTIFICATE_PASSWORD ?? "",
    })
  ).asPem();

  const validNfe: NfeInfNfe = {
    "@_versao": "4.00",
    "@_Id": "NFe12345678901234567890123456789012345678901234",
    ide: {
      cUF: "35",
      cNF: "12345678",
      natOp: "Venda",
      mod: "55",
      serie: "001",
      nNF: "123456",
      dhEmi: "2024-12-06T08:00:00",
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
      CPF: "12345678909",
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
      CNPJ: "98765432000195",
      idCadIntTran: "Intermediador123",
    },
    infAdic: {},
    infRespTec: {
      CNPJ: "12345678000195",
      xContato: "Responsável Técnico",
      email: "responsavel@empresa.com",
      fone: "11999999999",
    },
  };

  console.log(validNfe);

  const signRegex =
    /<Signature xmlns="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#">[\s\S]*?<SignedInfo>[\s\S]*?<CanonicalizationMethod Algorithm="http:\/\/www\.w3\.org\/TR\/2001\/REC-xml-c14n-20010315"\/>[\s\S]*?<SignatureMethod Algorithm="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#rsa-sha1"\/>[\s\S]*?<Reference URI="#NFe[\w\d]+">[\s\S]*?<Transforms>[\s\S]*?<Transform Algorithm="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#enveloped-signature"\/>[\s\S]*?<Transform Algorithm="http:\/\/www\.w3\.org\/TR\/2001\/REC-xml-c14n-20010315"\/>[\s\S]*?<\/Transforms>[\s\S]*?<DigestMethod Algorithm="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#sha1"\/>[\s\S]*?<DigestValue>[\w\+\/=]+<\/DigestValue>[\s\S]*?<\/Reference>[\s\S]*?<\/SignedInfo>[\s\S]*?<SignatureValue>[\w\+\/=]+<\/SignatureValue>[\s\S]*?<KeyInfo>[\s\S]*?<X509Data>[\s\S]*?<X509Certificate>[\w\+\/=]+<\/X509Certificate>[\s\S]*?<\/X509Data>[\s\S]*?<\/KeyInfo>[\s\S]*?<\/Signature>/;

  test("Returns true when generate and sign the XML correctly", async () => {
    const signedXML = await signNfe(validNfe, {
      privateKey: key,
      publicCert: cert,
    });
    expect(signRegex.test(signedXML.Nfe)).toBeTrue();
  });
});
