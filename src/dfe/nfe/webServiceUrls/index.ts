import type { Uf } from "@/ufCode/types";

import { NfeWebServiceNotFoundError } from "./errors";
import type {
  AuthServer,
  Environment,
  GetWebServiceUrlOptions,
  NfeWebService,
  WebServiceUrls,
} from "./types";

/**
 * @description UF que tem seu próprio ambiente Sefaz: AM, BA, GO, MT, MS, MG, PR, PE, RS, SP
 * UF que utilizam a SVAN - Sefaz Virtual do Ambiente Nacional: MA
 * UF que utilizam a SVRS - Sefaz Virtual do RS:
 * - Para serviço de Consulta Cadastro: AC, ES, RN, PB, SC
 * - Para demais serviços relacionados com o sistema da NF-e: AC, AL, AP, CE, DF, ES, PA, PB, PI, RJ, RN, RO, RR, SC, SE, TO
 * Autorizadores em contingência:
 * - UF que utilizam a SVC-AN - Sefaz Virtual de Contingência Ambiente Nacional: AC, AL, AP, CE, DF, ES, MG, PA, PB, PI (Produção), RJ, RN, RO, RR, RS, SC, SE, SP, TO
 * - UF que utilizam a SVC-RS - Sefaz Virtual de Contingência Rio Grande do Sul: AM, BA, GO, MA, MS, MT, PE, PI (Homologação), PR
 */
const ufEnvMap = {
  self: new Set<Uf>([
    "AM",
    "BA",
    "GO",
    "MT",
    "MS",
    "MG",
    "PR",
    "PE",
    "RS",
    "SP",
  ]),
  SVAN: new Set<Uf>(["MA"]),
  SVRS_CC: new Set<Uf>(["AC", "ES", "RN", "PB", "SC"]),
  SVRS: new Set<Uf>([
    "AC",
    "AL",
    "AP",
    "CE",
    "DF",
    "ES",
    "PA",
    "PB",
    "PI",
    "RJ",
    "RN",
    "RO",
    "RR",
    "SC",
    "SE",
    "TO",
  ]),
  SVCAN: new Set<Uf>([
    "AC",
    "AL",
    "AP",
    "CE",
    "DF",
    "ES",
    "MG",
    "PA",
    "PB",
    "RJ",
    "RN",
    "RO",
    "RR",
    "RS",
    "SC",
    "SE",
    "SP",
    "TO",
  ]),
  SVCRS: new Set<Uf>(["AM", "BA", "GO", "MA", "MS", "MT", "PE", "PR"]),
};

/**
 * @description Mais informações
 * Produção: https://www.nfe.fazenda.gov.br/portal/webServices.aspx?tipoConteudo=OUC/YVNWZfo=
 * Homologação: https://hom.nfe.fazenda.gov.br/PORTAL/webServices.aspx?tipoConteudo=OUC/YVNWZfo=
 */
const webServices: WebServiceUrls = {
  producao: {
    AM: {
      NfeInutilizacao:
        "https://nfe.sefaz.am.gov.br/services2/services/NfeInutilizacao4",
      NfeConsultaProtocolo:
        "https://nfe.sefaz.am.gov.br/services2/services/NfeConsulta4",
      NfeStatusServico:
        "https://nfe.sefaz.am.gov.br/services2/services/NfeStatusServico4",
      RecepcaoEvento:
        "https://nfe.sefaz.am.gov.br/services2/services/RecepcaoEvento4",
      NFeAutorizacao:
        "https://nfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4",
      NFeRetAutorizacao:
        "https://nfe.sefaz.am.gov.br/services2/services/NfeRetAutorizacao4",
    },
    BA: {
      NfeInutilizacao:
        "https://nfe.sefaz.ba.gov.br/webservices/NFeInutilizacao4/NFeInutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://nfe.sefaz.ba.gov.br/webservices/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx",
      NfeStatusServico:
        "https://nfe.sefaz.ba.gov.br/webservices/NFeStatusServico4/NFeStatusServico4.asmx",
      NfeConsultaCadastro:
        "https://nfe.sefaz.ba.gov.br/webservices/CadConsultaCadastro4/CadConsultaCadastro4.asmx",
      RecepcaoEvento:
        "https://nfe.sefaz.ba.gov.br/webservices/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx",
      NFeAutorizacao:
        "https://nfe.sefaz.ba.gov.br/webservices/NFeAutorizacao4/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://nfe.sefaz.ba.gov.br/webservices/NFeRetAutorizacao4/NFeRetAutorizacao4.asmx",
    },
    GO: {
      NfeInutilizacao:
        "https://nfe.sefaz.go.gov.br/nfe/services/NFeInutilizacao4?wsdl",
      NfeConsultaProtocolo:
        "https://nfe.sefaz.go.gov.br/nfe/services/NFeConsultaProtocolo4?wsdl",
      NfeStatusServico:
        "https://nfe.sefaz.go.gov.br/nfe/services/NFeStatusServico4?wsdl",
      NfeConsultaCadastro:
        "https://nfe.sefaz.go.gov.br/nfe/services/CadConsultaCadastro4?wsdl",
      RecepcaoEvento:
        "https://nfe.sefaz.go.gov.br/nfe/services/NFeRecepcaoEvento4?wsdl",
      NFeAutorizacao:
        "https://nfe.sefaz.go.gov.br/nfe/services/NFeAutorizacao4?wsdl",
      NFeRetAutorizacao:
        "https://nfe.sefaz.go.gov.br/nfe/services/NFeRetAutorizacao4?wsdl",
    },
    MG: {
      NfeInutilizacao:
        "https://nfe.fazenda.mg.gov.br/nfe2/services/NFeInutilizacao4",
      NfeConsultaProtocolo:
        "https://nfe.fazenda.mg.gov.br/nfe2/services/NFeConsultaProtocolo4",
      NfeStatusServico:
        "https://nfe.fazenda.mg.gov.br/nfe2/services/NFeStatusServico4",
      NfeConsultaCadastro:
        "https://nfe.fazenda.mg.gov.br/nfe2/services/CadConsultaCadastro4",
      RecepcaoEvento:
        "https://nfe.fazenda.mg.gov.br/nfe2/services/NFeRecepcaoEvento4",
      NFeAutorizacao:
        "https://nfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4",
      NFeRetAutorizacao:
        "https://nfe.fazenda.mg.gov.br/nfe2/services/NFeRetAutorizacao4",
    },
    MS: {
      NfeInutilizacao: "https://nfe.sefaz.ms.gov.br/ws/NFeInutilizacao4",
      NfeConsultaProtocolo:
        "https://nfe.sefaz.ms.gov.br/ws/NFeConsultaProtocolo4",
      NfeStatusServico: "https://nfe.sefaz.ms.gov.br/ws/NFeStatusServico4",
      NfeConsultaCadastro:
        "https://nfe.sefaz.ms.gov.br/ws/CadConsultaCadastro4",
      RecepcaoEvento: "https://nfe.sefaz.ms.gov.br/ws/NFeRecepcaoEvento4",
      NFeAutorizacao: "https://nfe.sefaz.ms.gov.br/ws/NFeAutorizacao4",
      NFeRetAutorizacao: "https://nfe.sefaz.ms.gov.br/ws/NFeRetAutorizacao4",
    },
    MT: {
      NfeInutilizacao:
        "https://nfe.sefaz.mt.gov.br/nfews/v2/services/NfeInutilizacao4?wsdl",
      NfeConsultaProtocolo:
        "https://nfe.sefaz.mt.gov.br/nfews/v2/services/NfeConsulta4?wsdl",
      NfeStatusServico:
        "https://nfe.sefaz.mt.gov.br/nfews/v2/services/NfeStatusServico4?wsdl",
      NfeConsultaCadastro:
        "https://nfe.sefaz.mt.gov.br/nfews/v2/services/CadConsultaCadastro4?wsdl",
      RecepcaoEvento:
        "https://nfe.sefaz.mt.gov.br/nfews/v2/services/RecepcaoEvento4?wsdl",
      NFeAutorizacao:
        "https://nfe.sefaz.mt.gov.br/nfews/v2/services/NfeAutorizacao4?wsdl",
      NFeRetAutorizacao:
        "https://nfe.sefaz.mt.gov.br/nfews/v2/services/NfeRetAutorizacao4?wsdl",
    },
    PE: {
      NfeInutilizacao:
        "https://nfe.sefaz.pe.gov.br/nfe-service/services/NFeInutilizacao4",
      NfeConsultaProtocolo:
        "https://nfe.sefaz.pe.gov.br/nfe-service/services/NFeConsultaProtocolo4",
      NfeStatusServico:
        "https://nfe.sefaz.pe.gov.br/nfe-service/services/NFeStatusServico4",
      NfeConsultaCadastro:
        "https://nfe.sefaz.pe.gov.br/nfe-service/services/CadConsultaCadastro4?wsdl",
      RecepcaoEvento:
        "https://nfe.sefaz.pe.gov.br/nfe-service/services/NFeRecepcaoEvento4",
      NFeAutorizacao:
        "https://nfe.sefaz.pe.gov.br/nfe-service/services/NFeAutorizacao4",
      NFeRetAutorizacao:
        "https://nfe.sefaz.pe.gov.br/nfe-service/services/NFeRetAutorizacao4",
    },
    PR: {
      NfeInutilizacao: "https://nfe.sefa.pr.gov.br/nfe/NFeInutilizacao4?wsdl",
      NfeConsultaProtocolo:
        "https://nfe.sefa.pr.gov.br/nfe/NFeConsultaProtocolo4?wsdl",
      NfeStatusServico: "https://nfe.sefa.pr.gov.br/nfe/NFeStatusServico4?wsdl",
      NfeConsultaCadastro:
        "https://nfe.sefa.pr.gov.br/nfe/CadConsultaCadastro4?wsdl",
      RecepcaoEvento: "https://nfe.sefa.pr.gov.br/nfe/NFeRecepcaoEvento4?wsdl",
      NFeAutorizacao: "https://nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4?wsdl",
      NFeRetAutorizacao:
        "https://nfe.sefa.pr.gov.br/nfe/NFeRetAutorizacao4?wsdl",
    },
    RS: {
      NfeInutilizacao:
        "https://nfe.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://nfe.sefazrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx",
      NfeStatusServico:
        "https://nfe.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx",
      NfeConsultaCadastro:
        "https://cad.sefazrs.rs.gov.br/ws/cadconsultacadastro/cadconsultacadastro4.asmx",
      RecepcaoEvento:
        "https://nfe.sefazrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx",
      NFeAutorizacao:
        "https://nfe.sefazrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://nfe.sefazrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx",
    },
    SP: {
      NfeInutilizacao: "https://nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx",
      NfeStatusServico:
        "https://nfe.fazenda.sp.gov.br/ws/nfestatusservico4.asmx",
      NfeConsultaCadastro:
        "https://nfe.fazenda.sp.gov.br/ws/cadconsultacadastro4.asmx",
      RecepcaoEvento:
        "https://nfe.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx",
      NFeAutorizacao: "https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx",
      NFeRetAutorizacao:
        "https://nfe.fazenda.sp.gov.br/ws/nferetautorizacao4.asmx",
    },
    SVAN: {
      NfeInutilizacao:
        "https://www.sefazvirtual.fazenda.gov.br/NFeInutilizacao4/NFeInutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://www.sefazvirtual.fazenda.gov.br/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx",
      NfeStatusServico:
        "https://www.sefazvirtual.fazenda.gov.br/NFeStatusServico4/NFeStatusServico4.asmx",
      RecepcaoEvento:
        "https://www.sefazvirtual.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx",
      NFeAutorizacao:
        "https://www.sefazvirtual.fazenda.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://www.sefazvirtual.fazenda.gov.br/NFeRetAutorizacao4/NFeRetAutorizacao4.asmx",
    },
    SVRS: {
      NfeInutilizacao:
        "https://nfe.svrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://nfe.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx",
      NfeStatusServico:
        "https://nfe.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx",
      NfeConsultaCadastro:
        "https://cad.svrs.rs.gov.br/ws/cadconsultacadastro/cadconsultacadastro4.asmx",
      RecepcaoEvento:
        "https://nfe.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx",
      NFeAutorizacao:
        "https://nfe.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://nfe.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx",
    },
    SVCAN: {
      NfeInutilizacao:
        "https://www.sefazvirtual.fazenda.gov.br/NFeInutilizacao4/NFeInutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://www.sefazvirtual.fazenda.gov.br/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx",
      NfeStatusServico:
        "https://www.sefazvirtual.fazenda.gov.br/NFeStatusServico4/NFeStatusServico4.asmx",
      RecepcaoEvento:
        "https://www.sefazvirtual.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx",
      NFeAutorizacao:
        "https://www.sefazvirtual.fazenda.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://www.sefazvirtual.fazenda.gov.br/NFeRetAutorizacao4/NFeRetAutorizacao4.asmx",
    },
    SVCRS: {
      NfeConsultaProtocolo:
        "https://nfe.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx",
      NfeStatusServico:
        "https://nfe.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx",
      RecepcaoEvento:
        "https://nfe.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx",
      NFeAutorizacao:
        "https://nfe.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://nfe.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx",
    },
    AN: {
      NFeDistribuicaoDFe:
        "https://www1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx",
      RecepcaoEvento:
        "https://www.nfe.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx",
    },
  },
  homologacao: {
    AM: {
      NfeInutilizacao:
        "https://homnfe.sefaz.am.gov.br/services2/services/NfeInutilizacao4",
      NfeConsultaProtocolo:
        "https://homnfe.sefaz.am.gov.br/services2/services/NfeConsulta4",
      NfeStatusServico:
        "https://homnfe.sefaz.am.gov.br/services2/services/NfeStatusServico4",
      RecepcaoEvento:
        "https://homnfe.sefaz.am.gov.br/services2/services/RecepcaoEvento4",
      NFeAutorizacao:
        "https://homnfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4",
      NFeRetAutorizacao:
        "https://homnfe.sefaz.am.gov.br/services2/services/NfeRetAutorizacao4",
    },
    BA: {
      NfeInutilizacao:
        "https://hnfe.sefaz.ba.gov.br/webservices/NFeInutilizacao4/NFeInutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://hnfe.sefaz.ba.gov.br/webservices/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx",
      NfeStatusServico:
        "https://hnfe.sefaz.ba.gov.br/webservices/NFeStatusServico4/NFeStatusServico4.asmx",
      NfeConsultaCadastro:
        "https://hnfe.sefaz.ba.gov.br/webservices/CadConsultaCadastro4/CadConsultaCadastro4.asmx",
      RecepcaoEvento:
        "https://hnfe.sefaz.ba.gov.br/webservices/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx",
      NFeAutorizacao:
        "https://hnfe.sefaz.ba.gov.br/webservices/NFeAutorizacao4/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://hnfe.sefaz.ba.gov.br/webservices/NFeRetAutorizacao4/NFeRetAutorizacao4.asmx",
    },
    GO: {
      NfeInutilizacao:
        "https://homolog.sefaz.go.gov.br/nfe/services/NFeInutilizacao4?wsdl",
      NfeConsultaProtocolo:
        "https://homolog.sefaz.go.gov.br/nfe/services/NFeConsultaProtocolo4?wsdl",
      NfeStatusServico:
        "https://homolog.sefaz.go.gov.br/nfe/services/NFeStatusServico4?wsdl",
      NfeConsultaCadastro:
        "https://homolog.sefaz.go.gov.br/nfe/services/CadConsultaCadastro4?wsdl",
      RecepcaoEvento:
        "https://homolog.sefaz.go.gov.br/nfe/services/NFeRecepcaoEvento4?wsdl",
      NFeAutorizacao:
        "https://homolog.sefaz.go.gov.br/nfe/services/NFeAutorizacao4?wsdl",
      NFeRetAutorizacao:
        "https://homolog.sefaz.go.gov.br/nfe/services/NFeRetAutorizacao4?wsdl",
    },
    MG: {
      NfeInutilizacao:
        "https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeInutilizacao4",
      NfeConsultaProtocolo:
        "https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeConsultaProtocolo4",
      NfeStatusServico:
        "https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeStatusServico4",
      NfeConsultaCadastro:
        "https://hnfe.fazenda.mg.gov.br/nfe2/services/CadConsultaCadastro4",
      RecepcaoEvento:
        "https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeRecepcaoEvento4",
      NFeAutorizacao:
        "https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4",
      NFeRetAutorizacao:
        "https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeRetAutorizacao4",
    },
    MS: {
      NfeInutilizacao: "https://hom.nfe.sefaz.ms.gov.br/ws/NFeInutilizacao4",
      NfeConsultaProtocolo:
        "https://hom.nfe.sefaz.ms.gov.br/ws/NFeConsultaProtocolo4",
      NfeStatusServico: "https://hom.nfe.sefaz.ms.gov.br/ws/NFeStatusServico4",
      NfeConsultaCadastro:
        "https://hom.nfe.sefaz.ms.gov.br/ws/CadConsultaCadastro4",
      RecepcaoEvento: "https://hom.nfe.sefaz.ms.gov.br/ws/NFeRecepcaoEvento4",
      NFeAutorizacao: "https://hom.nfe.sefaz.ms.gov.br/ws/NFeAutorizacao4",
      NFeRetAutorizacao:
        "https://hom.nfe.sefaz.ms.gov.br/ws/NFeRetAutorizacao4",
    },
    MT: {
      NfeInutilizacao:
        "https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeInutilizacao4?wsdl",
      NfeConsultaProtocolo:
        "https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeConsulta4?wsdl",
      NfeStatusServico:
        "https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeStatusServico4?wsdl",
      NfeConsultaCadastro:
        "https://homologacao.sefaz.mt.gov.br/nfews/v2/services/CadConsultaCadastro4?wsdl",
      RecepcaoEvento:
        "https://homologacao.sefaz.mt.gov.br/nfews/v2/services/RecepcaoEvento4?wsdl",
      NFeAutorizacao:
        "https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeAutorizacao4?wsdl",
      NFeRetAutorizacao:
        "https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeRetAutorizacao4?wsdl",
    },
    PE: {
      NfeInutilizacao:
        "https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeInutilizacao4?wsdl",
      NfeConsultaProtocolo:
        "https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeConsultaProtocolo4?wsdl",
      NfeStatusServico:
        "https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeStatusServico4?wsdl",
      NfeConsultaCadastro:
        "https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/CadConsultaCadastro4?wsdl",
      RecepcaoEvento:
        "https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeRecepcaoEvento4?wsdl",
      NFeAutorizacao:
        "https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeAutorizacao4?wsdl",
      NFeRetAutorizacao:
        "https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeRetAutorizacao4?wsdl",
    },
    PR: {
      NfeInutilizacao:
        "https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeInutilizacao4?wsdl",
      NfeConsultaProtocolo:
        "https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeConsultaProtocolo4?wsdl",
      NfeStatusServico:
        "https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeStatusServico4?wsdl",
      NfeConsultaCadastro:
        "https://homologacao.nfe.sefa.pr.gov.br/nfe/CadConsultaCadastro4?wsdl",
      RecepcaoEvento:
        "https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeRecepcaoEvento4?wsdl",
      NFeAutorizacao:
        "https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4?wsdl",
      NFeRetAutorizacao:
        "https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeRetAutorizacao4?wsdl",
    },
    RS: {
      NfeInutilizacao:
        "https://nfe-homologacao.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx",
      NfeStatusServico:
        "https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx",
      NfeConsultaCadastro:
        "https://cad.sefazrs.rs.gov.br/ws/cadconsultacadastro/cadconsultacadastro4.asmx",
      RecepcaoEvento:
        "https://nfe-homologacao.sefazrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx",
      NFeAutorizacao:
        "https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx",
    },
    SP: {
      NfeInutilizacao:
        "https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx",
      NfeStatusServico:
        "https://homologacao.nfe.fazenda.sp.gov.br/ws/nfestatusservico4.asmx",
      NfeConsultaCadastro:
        "https://homologacao.nfe.fazenda.sp.gov.br/ws/cadconsultacadastro4.asmx",
      RecepcaoEvento:
        "https://homologacao.nfe.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx",
      NFeAutorizacao:
        "https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx",
      NFeRetAutorizacao:
        "https://homologacao.nfe.fazenda.sp.gov.br/ws/nferetautorizacao4.asmx",
    },
    SVAN: {
      NfeInutilizacao:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeInutilizacao4/NFeInutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx",
      NfeStatusServico:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeStatusServico4/NFeStatusServico4.asmx",
      RecepcaoEvento:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx",
      NFeAutorizacao:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeRetAutorizacao4/NFeRetAutorizacao4.asmx",
    },
    SVRS: {
      NfeInutilizacao:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx",
      NfeStatusServico:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx",
      NfeConsultaCadastro:
        "https://cad-homologacao.svrs.rs.gov.br/ws/cadconsultacadastro/cadconsultacadastro4.asmx",
      RecepcaoEvento:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx",
      NFeAutorizacao:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx",
    },
    SVCAN: {
      NfeInutilizacao:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeInutilizacao4/NFeInutilizacao4.asmx",
      NfeConsultaProtocolo:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx",
      NfeStatusServico:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeStatusServico4/NFeStatusServico4.asmx",
      RecepcaoEvento:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx",
      NFeAutorizacao:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://hom.sefazvirtual.fazenda.gov.br/NFeRetAutorizacao4/NFeRetAutorizacao4.asmx",
    },
    SVCRS: {
      NfeConsultaProtocolo:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx",
      NfeStatusServico:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx",
      RecepcaoEvento:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx",
      NFeAutorizacao:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx",
      NFeRetAutorizacao:
        "https://nfe-homologacao.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx",
    },
    AN: {
      NFeDistribuicaoDFe:
        "https://hom1.nfe.fazenda.gov.br/NFeDistribuicaoDFe/NFeDistribuicaoDFe.asmx",
      RecepcaoEvento:
        "https://hom1.nfe.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx",
    },
  },
};

/**
 * @description Autorizadores em contingência:
 * - UF que utilizam a SVC-AN - Sefaz Virtual de Contingência Ambiente Nacional: AC, AL, AP, CE, DF, ES, MG, PA, PB, PI (Produção), RJ, RN, RO, RR, RS, SC, SE, SP, TO
 * - UF que utilizam a SVC-RS - Sefaz Virtual de Contingência Rio Grande do Sul: AM, BA, GO, MA, MS, MT, PE, PI (Homologação), PR
 */
function getWebServiceUrlContingencia(
  uf: Uf,
  service: NfeWebService,
  env: Environment,
): string | null {
  if (uf === "PI") {
    return (
      (env === "producao"
        ? webServices[env].SVCAN[service]
        : webServices[env].SVCRS[service]) ?? null
    );
  }
  if (ufEnvMap.SVCAN.has(uf)) {
    return webServices[env].SVCAN[service] ?? null;
  }
  if (ufEnvMap.SVCRS.has(uf)) {
    return webServices[env].SVCRS[service] ?? null;
  }

  return null;
}

/**
 * @description UF que tem seu próprio ambiente Sefaz: AM, BA, GO, MT, MS, MG, PR, PE, RS, SP
 * UF que utilizam a SVAN - Sefaz Virtual do Ambiente Nacional: MA
 * UF que utilizam a SVRS - Sefaz Virtual do RS:
 * - Para serviço de Consulta Cadastro: AC, ES, RN, PB, SC
 * - Para demais serviços relacionados com o sistema da NF-e: AC, AL, AP, CE, DF, ES, PA, PB, PI, RJ, RN, RO, RR, SC, SE, TO
 */
function getWebServiceUrlNormal(
  uf: Uf,
  service: NfeWebService,
  env: Environment,
): string | null {
  if (ufEnvMap.self.has(uf)) {
    return webServices[env][uf as AuthServer][service] ?? null;
  }
  if (ufEnvMap.SVAN.has(uf)) {
    return webServices[env].SVAN[service] ?? null;
  }
  if (ufEnvMap.SVRS_CC.has(uf) && service === "NfeConsultaCadastro") {
    return webServices[env].SVRS[service] ?? null;
  }
  if (ufEnvMap.SVRS.has(uf)) {
    return webServices[env].SVRS[service] ?? null;
  }

  return null;
}

/**
 * @description Retorna a URL do WebService de acordo com a UF, serviço, ambiente e se o servidor está, ou não, em contingência.
 *
 * @param {GetWebServiceUrlOptions} options
 *
 * @returns {string} URL do WebService
 *
 * @throws {NfeWebServiceNotFoundError} Se a URL do WebService não for encontrada
 */
export function getWebServiceUrl({
  uf,
  service,
  env,
  contingency,
}: GetWebServiceUrlOptions): string {
  let url: string | null;
  if (service === "NFeDistribuicaoDFe") {
    url = webServices[env].AN.NFeDistribuicaoDFe ?? null;
  } else {
    url =
      (contingency
        ? getWebServiceUrlContingencia(uf, service, env)
        : getWebServiceUrlNormal(uf, service, env)) ?? null;
  }

  if (!url) {
    throw new NfeWebServiceNotFoundError({ uf, service, env, contingency });
  }
  return url;
}
