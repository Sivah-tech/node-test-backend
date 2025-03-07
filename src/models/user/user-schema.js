import { Schema, model } from "mongoose";
const usersSchema = new Schema({
    identifier: {
        type: String,
        // required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    fullName: {
        type: String,
        requried: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    phoneNumber: {
        type: String,
        default: null
    },
    profilePic: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
}, { timestamps: true });
export const usersModel = model("users", usersSchema);
