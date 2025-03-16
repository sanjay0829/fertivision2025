import mongoose, { Schema, Document } from "mongoose";

export interface Category extends Document {
  category_name: string;
  conf_amount: number;
  accompany_amount: number;
  workshop_amount: number;
  cme_amount: number;
  banquet_amount: number;
}

const CategorySchema: Schema<Category> = new Schema(
  {
    category_name: {
      type: String,
      required: [true, "Category Name is required"],
      trim: true,
      unique: [true, "Category name must be unique"],
    },
    conf_amount: { type: Number, default: 0, trim: true },
    accompany_amount: { type: Number, default: 0, trim: true },
    workshop_amount: { type: Number, default: 0, trim: true },
    cme_amount: { type: Number, default: 0, trim: true },
    banquet_amount: { type: Number, default: 0, trim: true },
  },
  { timestamps: true }
);

const CategoryModel =
  (mongoose.models.Category as mongoose.Model<Category>) ||
  mongoose.model<Category>("Category", CategorySchema);

export default CategoryModel;
