import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    Name: {
        type: String,
        required: false
    },
    status: {
        type: String,
        default: 0
    },

}, { timestamps: true })

export const categoryModel = model("category", categorySchema)

