import type { Environment, UF } from "@/dfe/nfe/types";

type AuthServer =
	| "AM"
	| "BA"
	| "GO"
	| "MG"
	| "MS"
	| "MT"
	| "PE"
	| "PR"
	| "RS"
	| "SP"
	| "SVAN"
	| "SVRS"
	| "SVCAN"
	| "SVCRS"
	| "AN";

type WebService =
	| "NfeInutilizacao"
	| "NfeConsultaProtocolo"
	| "NfeStatusServico"
	| "NfeConsultaCadastro"
	| "RecepcaoEvento"
	| "NFeAutorizacao"
	| "NFeRetAutorizacao"
	| "NFeDistribuicaoDFe";

/**
 * @description More info at https://www.nfe.fazenda.gov.br/portal/webServices.aspx?tipoConteudo=OUC/YVNWZfo=
 */
const webServices: {
	[server in AuthServer]: {
		[service in WebService]?: string;
	};
} = {
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
		NfeConsultaCadastro: "https://nfe.sefaz.ms.gov.br/ws/CadConsultaCadastro4",
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
		NFeRetAutorizacao: "https://nfe.sefa.pr.gov.br/nfe/NFeRetAutorizacao4?wsdl",
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
		NfeStatusServico: "https://nfe.fazenda.sp.gov.br/ws/nfestatusservico4.asmx",
		NfeConsultaCadastro:
			"https://nfe.fazenda.sp.gov.br/ws/cadconsultacadastro4.asmx",
		RecepcaoEvento: "https://nfe.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx",
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
			"https://www.svc.fazenda.gov.br/NFeInutilizacao4/NFeInutilizacao4.asmx",
		NfeConsultaProtocolo:
			"https://www.svc.fazenda.gov.br/NFeConsultaProtocolo4/NFeConsultaProtocolo4.asmx",
		NfeStatusServico:
			"https://www.svc.fazenda.gov.br/NFeStatusServico4/NFeStatusServico4.asmx",
		RecepcaoEvento:
			"https://www.svc.fazenda.gov.br/NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx",
		NFeAutorizacao:
			"https://www.svc.fazenda.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx",
		NFeRetAutorizacao:
			"https://www.svc.fazenda.gov.br/NFeRetAutorizacao4/NFeRetAutorizacao4.asmx",
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
};

interface GetWebServiceUrl {
	uf: UF;
	service: WebService;
	env: Environment;
}

/**
 * @description
 * 	UF que utilizam a SVAN - Sefaz Virtual do Ambiente Nacional: MA
 *	UF que utilizam a SVRS - Sefaz Virtual do RS:
 *	- Para serviço de Consulta Cadastro: AC, ES, RN, PB, SC
 *	- Para demais serviços relacionados com o sistema da NF-e: AC, AL, AP, CE, DF, ES, PA, PB, PI, RJ, RN, RO, RR, SC, SE, TO
 *	Autorizadores em contingência:
 *	- UF que utilizam a SVC-AN - Sefaz Virtual de Contingência Ambiente Nacional: AC, AL, AP, CE, DF, ES, MG, PA, PB, PI, RJ, RN, RO, RR, RS, SC, SE, SP, TO
 *	- UF que utilizam a SVC-RS - Sefaz Virtual de Contingência Rio Grande do Sul: AM, BA, GO, MA, MS, MT, PE, PR
 *
 * @returns The URL of the web service, for that UF.
 */
export function getWebServiceUrl({
	uf,
	service,
	env,
}: GetWebServiceUrl): string {
	let url: string | undefined;
	if (env === "qa") {
		if (
			[
				"AC",
				"AL",
				"AP",
				"CE",
				"DF",
				"ES",
				"MG",
				"PA",
				"PB",
				"PI",
				"RJ",
				"RN",
				"RO",
				"RR",
				"RS",
				"SC",
				"SE",
				"SP",
				"TO",
			].includes(uf)
		) {
			url = webServices.SVCAN[service];
		} else if (["AM", "BA", "GO", "MA", "MS", "MT", "PE", "PR"].includes(uf)) {
			url = webServices.SVCRS[service];
		}
	} else if (uf === "MA") {
		url = webServices.SVAN[service];
	} else if (
		["AC", "ES", "RN", "PB", "SC"].includes(uf) &&
		service === "NfeConsultaCadastro"
	) {
		url = webServices.SVRS[service];
	} else if (
		[
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
		].includes(uf)
	) {
		url = webServices.SVRS[service];
	}
	if (!url) {
		throw new Error(`Web service not found for ${service}/${uf} (${env})`);
	}
	return url;
}
