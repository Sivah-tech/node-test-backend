import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    Name: {
      type: String,
      required: false,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "category",
    },

    Image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

export const productModel = model("product", ProductSchema);
