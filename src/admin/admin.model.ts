import { Schema } from "mongoose";

export const AdminSchema = new Schema({
    email: { type: String, required: true, unique: true },
});