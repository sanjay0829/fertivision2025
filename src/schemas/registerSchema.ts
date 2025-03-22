import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/pdf",
];

export const RegisterSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    fullname: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name must be less tha 50 character"),
    // lname: z
    //   .string()
    //   .min(1, "Last Name is required")
    //   .max(50, "Name must be less tha 50 character"),
    reg_category: z.string().min(1, "Registration Category  is required"),
    email: z.string().email({ message: "please enter a valid email id" }),
    mobile: z
      .string()
      .regex(/^[+0-9]{10,17}$/, "Phone number must be a valid  number"),
    company: z.string().min(1, "Affiliation Name is required"),
    member_no: z.string().optional(),
    gender: z.string().optional(),
    city: z.string().min(1, "City Name is required"),
    state: z.string().optional(),
    country: z.string().min(1, "Country Name is reuired"),
    pin: z.string().min(1, "Pincode is reuired"),
    address: z.string().min(1, "Address is required"),
    nationality: z.string(),
    no_of_accompany: z.number().min(0).max(3),
    accompany_persons: z
      .array(
        z.object({
          accompany_name: z.string().min(3, "Name is required"),
          accompany_age: z.number().min(1, "Age is reuired"),
          accompany_gender: z.string().min(3, "Gender is required"),
        })
      )
      .optional()
      .default([]),
    pre_workshop: z.string().optional(),
    post_workshop: z.string().optional(),
    total_amount: z.number(),
    banquet_amount: z.number().default(0),
    accompany_amount: z.number(),
    workshop_amount: z.number().default(0),
    cme_amount: z.number().default(0),
    conf_amount: z.number(),
    currency: z.string(),
    pg_certificate_file: z
      .any()
      .optional()
      .refine(
        (file) =>
          file && file.length == 1
            ? file[0]?.size <= MAX_FILE_SIZE
              ? true
              : false
            : true,
        "Max file size allowed is 5 MB."
      )
      .refine(
        (file) =>
          file && file.length == 1
            ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
              ? true
              : false
            : true,
        "Only .doc, .docx, .pdf  formats are supported."
      ),
    senior_citizen_certificate_file: z
      .any()
      .optional()
      .refine(
        (file) =>
          file && file.length == 1
            ? file[0]?.size <= MAX_FILE_SIZE
              ? true
              : false
            : true,
        "Max file size allowed is 5 MB."
      )
      .refine(
        (file) =>
          file && file.length == 1
            ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
              ? true
              : false
            : true,
        "Only .doc, .docx, .pdf  formats are supported."
      ),
  })
  .superRefine((data, ctx) => {
    if (
      data.reg_category === "PG Students" &&
      (!data.pg_certificate_file || data.pg_certificate_file.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "HOD Letter is required for PG Students",
        path: ["pg_certificate_file"],
      });
    }

    if (
      data.reg_category === "FOGSI Member (Above 75 Years)" &&
      (!data.senior_citizen_certificate_file ||
        data.senior_citizen_certificate_file.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Upload Id proof with date of birth",
        path: ["senior_citizen_certificate_file"],
      });
    }

    if (data.reg_category === "IFS Member" && !data.member_no) {
      ctx.addIssue({
        code: "custom",
        message: "Membership number is required for IFS Members",
        path: ["member_no"],
      });
    }
    if (
      data.reg_category === "Only Workshop Registration" &&
      data.pre_workshop == "" &&
      data.post_workshop == ""
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Please select at least one workshop",
        path: ["pre_workshop"],
      });

      ctx.addIssue({
        code: "custom",
        message: "Please select at least one workshop",
        path: ["post_workshop"],
      });
    }
  });
