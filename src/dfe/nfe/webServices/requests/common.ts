export interface NfeRequestOptions<Body> {
  body: Body;
  timeout: number;
  signId?: string;
}

export interface NfeWebServiceResponse<Status, Raw> {
  status: Status | "outro";
  description: string;
  raw: Raw;
}
