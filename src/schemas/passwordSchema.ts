import { z } from "zod";

export const PasswordSchema = z
  .object({
    oldpassword: z.string().min(1, "Please enter Old Password"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    confirmpassword: z.string().min(1, "Please confirm Password"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    path: ["confirmpassword"],
    message: "Passwords must match!",
  });
