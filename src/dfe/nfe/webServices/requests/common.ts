export interface NfeRequestOptions<Body> {
  body: Body;
  timeout: number;
}

export interface NfeWebServiceResponse<Status, Raw> {
  status: Status | "outro";
  description: string;
  raw: Raw;
}
