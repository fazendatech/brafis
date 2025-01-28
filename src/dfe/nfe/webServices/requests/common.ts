export interface NfeRequestOptions<Body> {
  body: Body;
  timeout: number;
  arrayTags?: string[];
}

export interface NfeResultMsg<Result> {
  nfeResultMsg: Result;
}
