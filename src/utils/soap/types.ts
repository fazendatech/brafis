import type { LiteralStringUnion } from "@/utils/types";

export type WithXmlns<T = unknown> = {
  "@_xmlns": LiteralStringUnion<
    | "http://www.portalfiscal.inf.br/nfe"
    | "http://www.portalfiscal.inf.br/nfe/wsdl/NFeStatusServico4"
    | "http://www.portalfiscal.inf.br/nfe/wsdl/CadConsultaCadastro4"
    | "http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4"
    | "http://www.portalfiscal.inf.br/nfe/wsdl/NFeInutilizacao4"
    | "http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4"
    | "http://www.portalfiscal.inf.br/nfe/wsdl/NFeConsultaProtocolo4"
    | "http://www.portalfiscal.inf.br/nfe/wsdl/NFeDistribuicaoDFe"
  >;
} & T;

export type WithVersao<T = unknown> = { "@_versao": string } & T;

export type WithXmlnsVersao<T = unknown> = WithXmlns<WithVersao<T>>;
