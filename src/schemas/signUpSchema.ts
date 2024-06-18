import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(2, "username must contain atleast 2 charectors")
  .max(20, "username must exeed 20 charectors")
  .regex(/^[a-zA-Z0-9_]+$/, "username shouldn't contain special charectors");

export const signUpSchema = z.object({
  username: usernameSchema,
  email: z.string().email({ message: "enter a valid email" }),
  password: z.string().min(6, "password must contian atleast 6 words"),
});
