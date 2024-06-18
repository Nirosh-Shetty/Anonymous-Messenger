import { z } from "zod";

const signInSchema = z.object({
  identifier: z.string(),
  passsword: z.string(),
});
