import { Schema, model } from "mongoose";

const faqSchema = new Schema({
  identifier: {
    type: String,
    // required: true,
    unique: true
},
question: {
    type: String,
    requried: true
},
answer: {
    type: String,
    requried: true
},

}, { timestamps: true })

export const faqModel = model("faqs", faqSchema)