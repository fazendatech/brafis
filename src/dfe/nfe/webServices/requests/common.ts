export interface NfeRequestOptions<Body> {
  body: Body;
  timeout: number;
}

export type NfeWebServiceResponse<Status, Raw, Extra = unknown> = {
  status: Status | "outro";
  description: string;
  raw: Raw;
} & Extra;
