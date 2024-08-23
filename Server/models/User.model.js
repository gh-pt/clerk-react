import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    clerkUserId: {type: String, required: true, unique: true},
    fullName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
