import { z } from "zod";
import { ufCodeMap } from "@/ufCode";
import type { UF, UFCode } from "@/ufCode/types";
import type { NfeLayout } from ".";

// NOTE: Hack pro zod aceitar tipos customizados (https://stackoverflow.com/a/73825370)
const ufCodeList = Object.values(ufCodeMap);
const ufCodes: [UFCode, ...UFCode[]] = [ufCodeList[0], ...ufCodeList];
export const zUfCode = () => z.enum(ufCodes);

const ufList = Object.keys(ufCodeMap);
const ufs: [UF, ...UF[]] = [ufList[0], ...ufList];
export const zUf = () => z.enum(ufs);

// NOTE: NFe válida usada para testes
export const NFE_TEST_DATA: NfeLayout = {
  NFe: {
    "@_xmlns": "http://www.portalfiscal.inf.br/nfe",
    infNFe: {
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
          "@_nItem": "1",
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
    },
  },
};
