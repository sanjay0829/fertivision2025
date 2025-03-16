import { z } from "zod";

export const CategorySchema = z.object({
  category_name: z.string().min(1, "Category Name is required"),
  conf_amount: z.number().default(0),
  accompany_amount: z.number().default(0),
  workshop_amount: z.number().default(0),
  cme_amount: z.number().default(0),
  banquet_amount: z.number().default(0),
});
