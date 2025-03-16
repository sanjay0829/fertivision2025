import { z } from "zod";

export const SignupSchema = z
  .object({
    fname: z.string().min(1, "First Name is required"),
    lname: z.string().min(1, "Last Name is required"),
    email: z.string().email({ message: "Please enter a valid email id" }),
    password: z
      .string()
      .min(6, "Password must be atleast 6 characters")
      .max(10, "Password should not be more than 10 characters"),
    confirm_password: z
      .string()
      .min(6, "Confirm Password must be atleast 6 characters")
      .max(10, "Confirm Password should not be more than 10 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Confirm Password must match",
  });
