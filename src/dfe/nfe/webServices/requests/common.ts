import { z } from "zod";

// export interface NfeRequestOptions<Body> {
//   body: Body;
//   timeout: number;
//   sign?: { xpath?: string; id?: string };
// }

export const schemaNfeRequestOptions = z
  .object({
    body: z.any(),
    timeout: z.number(),
    sign: z
      .object({
        xpath: z.string().optional(),
        id: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    ({ sign }) => {
      if (!sign) {
        return true;
      }
      if (sign.xpath && !sign.id) {
        return true;
      }
      if (!sign.xpath && sign.id) {
        return true;
      }
      return false;
    },
    { message: "sign must have either xpath or id" },
  );

export type NfeRequestOptions = z.infer<typeof schemaNfeRequestOptions>;

export interface NfeWebServiceResponse<Status, Raw> {
  status: Status | "outro";
  description: string;
  raw: Raw;
}
