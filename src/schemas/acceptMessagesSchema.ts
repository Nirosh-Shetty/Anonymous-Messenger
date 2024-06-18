import { z } from "zod";

export const acceptgMessagesSchema = z.object({
  acceptgMessages: z.boolean(),
});
