import { z } from "zod";

export const AdminSchema = z
  .object({
    name: z
      .string()
      .min(1, "Admin Name is required")
      .max(20, "Admin name must be less than 20 character")
      .trim(),
    login_id: z
      .string()
      .min(6, "Admin Login id is required and Must be more than 6 character")
      .max(20, "Admin login id must be less than 20 character"),
    login_password: z
      .string()
      .min(
        6,
        "Admin Login password is required and Must be more than 6 character"
      )
      .max(20, "Admin login password must be less than 20 character"),
    confirm_password: z
      .string()
      .min(
        6,
        "Admin Login password is required and Must be more than 6 character"
      )
      .max(20, "Admin login password must be less than 20 character"),
    user_type: z.string().min(1, "User Type is required"),
  })
  .refine((data) => data.login_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords must match",
  });
