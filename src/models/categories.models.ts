import mongoose, { Schema } from "mongoose";

const categorieSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const CategoriesModel = mongoose.model("Categories", categorieSchema);
