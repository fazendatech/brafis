import { describe, expect, test } from "bun:test";
import { ZodError } from "zod";

import { NFE_TEST_DATA } from "./misc";

import { schemaNfeInfNfe } from "./groupA";
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
import { parseNfe } from ".";

describe("layout", () => {
  describe("zod schemas", () => {
    describe("groupA", () => {
      test("Returns success for a valid infNfe schema", () => {
        expect(() =>
          schemaNfeInfNfe.parse(NFE_TEST_DATA.NFe.infNFe),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupB", () => {
      test("Returns success for a valid ide schema", () => {
        expect(() =>
          schemaNfeIde.parse(NFE_TEST_DATA.NFe.infNFe.ide),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupBA", () => {
      const arrayNFref = NFE_TEST_DATA.NFe.infNFe.ide.NFref ?? [];
      for (const [i, NFref] of arrayNFref.entries()) {
        test(`Returns success for a valid NFref schema ${i + 1}`, () => {
          expect(() => schemaNfeNfRef.parse(NFref)).not.toThrow(ZodError);
        });
      }
    });

    describe("groupC", () => {
      test("Returns success for a valid emit schema", () => {
        expect(() =>
          schemaNfeEmit.parse(NFE_TEST_DATA.NFe.infNFe.emit),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupD", () => {
      test("Returns success for a valid avulsa schema", () => {
        expect(() =>
          schemaNfeAvulsa.parse(NFE_TEST_DATA.NFe.infNFe.avulsa),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupE", () => {
      test("Returns success for a valid dest schema", () => {
        expect(() =>
          schemaNfeDest.parse(NFE_TEST_DATA.NFe.infNFe.dest),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupF", () => {
      test("Returns success for a valid retirada schema", () => {
        expect(() =>
          schemaNfeRetirada.parse(NFE_TEST_DATA.NFe.infNFe.retirada),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupG", () => {
      test("Returns success for a valid entrega schema", () => {
        expect(() =>
          schemaNfeEntrega.parse(NFE_TEST_DATA.NFe.infNFe.entrega),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupGA", () => {
      test("Returns success for a valid autXML schema", () => {
        expect(() =>
          schemaNfeAutXml.parse(NFE_TEST_DATA.NFe.infNFe.autXML?.[0]),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupH", () => {
      test("Returns success for a valid det schema", () => {
        expect(() =>
          schemaNfeDet.parse(NFE_TEST_DATA.NFe.infNFe.det?.[0]),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupI", () => {
      test("Returns success for a valid prod schema", () => {
        expect(() =>
          schemaNfeProd.parse(NFE_TEST_DATA.NFe.infNFe.det[0].prod),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupI01", () => {
      test("Returns success for a valid DI schema", () => {
        expect(() =>
          schemaNfeDi.parse(NFE_TEST_DATA.NFe.infNFe.det[0].prod.DI?.[0]),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupI03", () => {
      test("Returns success for a valid detExport schema", () => {
        expect(() =>
          schemaNfeDetExport.parse(
            NFE_TEST_DATA.NFe.infNFe.det[0].prod.detExport?.[0],
          ),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupI80", () => {
      test("Returns success for a valid rastro schema", () => {
        expect(() =>
          schemaNfeRastro.parse(
            NFE_TEST_DATA.NFe.infNFe.det[0].prod.rastro?.[0],
          ),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupM", () => {
      test("Returns success for a valid imposto schema", () => {
        expect(() =>
          schemaNfeImposto.parse(NFE_TEST_DATA.NFe.infNFe.det[0].imposto),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupN01", () => {
      test("Returns success for a valid ICMS schema", () => {
        expect(() =>
          schemaNfeIcms.parse(NFE_TEST_DATA.NFe.infNFe.det[0].imposto.ICMS),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupW", () => {
      test("Returns success for a valid total schema", () => {
        expect(() =>
          schemaNfeTotal.parse(NFE_TEST_DATA.NFe.infNFe.total),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupW01", () => {
      test("Returns success for a valid ISSQNtot schema", () => {
        expect(() =>
          schemaNfeIssqnTot.parse(NFE_TEST_DATA.NFe.infNFe.total.ISSQNtot),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupW02", () => {
      test("Returns success for a valid retTrib schema", () => {
        expect(() =>
          schemaNfeRetTrib.parse(NFE_TEST_DATA.NFe.infNFe.total.retTrib),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupX", () => {
      test("Returns success for a valid transp schema", () => {
        expect(() =>
          schemaNfeTransp.parse(NFE_TEST_DATA.NFe.infNFe.transp),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupY", () => {
      test("Returns success for a valid cobr schema", () => {
        expect(() =>
          schemaNfeCobr.parse(NFE_TEST_DATA.NFe.infNFe.cobr),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupYA", () => {
      test("Returns success for a valid pag schema", () => {
        expect(() =>
          schemaNfePag.parse(NFE_TEST_DATA.NFe.infNFe.pag),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupYB", () => {
      test("Returns success for a valid infIntermed schema", () => {
        expect(() =>
          schemaNfeInfIntermed.parse(NFE_TEST_DATA.NFe.infNFe.infIntermed),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupZ", () => {
      test("Returns success for a valid infAdic schema", () => {
        expect(() =>
          schemaNfeInfAdic.parse(NFE_TEST_DATA.NFe.infNFe.infAdic),
        ).not.toThrow(ZodError);
      });
    });

    describe("groupZD", () => {
      test("Returns success for a valid groupZD schema", () => {
        expect(() =>
          schemaNfeInfRespTec.parse(NFE_TEST_DATA.NFe.infNFe.infRespTec),
        ).not.toThrow(ZodError);
      });
    });
  });

  describe("parseNfe", () => {
    test("Returns success for a valid NFe", () => {
      expect(() => parseNfe(NFE_TEST_DATA)).not.toThrow(ZodError);
    });

    test("Throws ZodError for an invalid NFe", () => {
      const invalidNfe = structuredClone(NFE_TEST_DATA);
      invalidNfe.NFe.infNFe["@_Id"] = "1";
      expect(() => parseNfe(invalidNfe)).toThrow(ZodError);
    });
  });
});
