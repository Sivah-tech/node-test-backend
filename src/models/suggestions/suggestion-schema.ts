import { Schema, model } from "mongoose";

const suggestionSchema = new Schema({
  identifier: {
    type: String,
    // required: true,
    unique: true
},
text: {
    type: String,
    requried: true
},


}, { timestamps: true })

export const suggestionModel = model("suggestion", suggestionSchema)