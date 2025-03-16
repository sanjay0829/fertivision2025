import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/pdf",
];

export const EditSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fullname: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less tha 50 character"),
  reg_category: z.string().min(1, "Registration Category  is required"),
  email: z.string().email({ message: "please enter a valid email id" }),
  mobile: z
    .string()
    .regex(/^[+0-9]{10,17}$/, "Phone number must be a valid  number"),
  company: z.string().min(1, "Affiliation Name is required"),
  member_no: z.string().optional(),
  mci_no: z.string().optional(),
  dob: z.coerce
    .date()
    .refine((val) => val !== null, { message: "Date of Birth is required" }),
  age: z.number().min(1, "Age is required"),
  gender: z.string(),
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
        accompany_banquet: z.string().default("No"),
      })
    )
    .optional()
    .default([]),
  workshop: z.string(),
  cme: z.string(),
  banquet: z.string(),
  total_amount: z.number(),
  banquet_amount: z.number(),
  accompany_amount: z.number(),
  workshop_amount: z.number(),
  cme_amount: z.number(),
  conf_amount: z.number(),
  currency: z.string(),
  payment_status: z.string().min(1, "Payment Status is required"),
  receipt_no: z.string(),
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
});
