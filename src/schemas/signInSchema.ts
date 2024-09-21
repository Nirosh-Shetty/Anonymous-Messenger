import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(),
  passsword: z.string(),
});
