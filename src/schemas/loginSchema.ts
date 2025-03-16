import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email().min(1, "Login Id is required"),
  password: z.string().min(1, "Password is required"),
});
