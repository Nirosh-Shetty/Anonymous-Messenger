import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "message should contain atleast 10 charectors")
    .min(300, "message should not exeed 300 charectors"),
});
