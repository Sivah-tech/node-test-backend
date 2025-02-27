import { Schema, model } from "mongoose";

const testimonialSchema = new Schema({
  identifier: {
    type: String,
    // required: true,
    unique: true
},
name: {
    type: String,
    requried: true
},
position: {
    type: String,
    requried: true
},
text: {
    type: String,
    requried: true
},
avatar: {
    type: String,
    requried: true
},


}, { timestamps: true })

export const testimonialModel = model("testimonial", testimonialSchema)