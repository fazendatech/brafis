export type WithXmlns<T = unknown> = { "@_xmlns": string } & T;
export type WithVersao<T = unknown> = { "@_versao": string } & T;
export type WithXmlnsVersao<T = unknown> = WithXmlns<WithVersao<T>>;
