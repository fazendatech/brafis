export interface NfeRequestOptions<Body> {
  body: Body;
  timeout: number;
  arrayTags?: string[];
}

export type NfeWebServiceResponse<Status, Raw, Extra = unknown> = {
  status: Status | "outro";
  description: string;
  raw: Raw;
} & Extra;

export type NfeResultMsg<Result> = { nfeResultMsg: Result };
