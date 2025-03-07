import { Schema, model } from "mongoose";

const contactusSchema = new Schema({
    username: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: false
    },

}, { timestamps: true })

export const contactusModel = model("contactus", contactusSchema)

