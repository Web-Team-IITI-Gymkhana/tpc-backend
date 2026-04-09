import { Schema } from "mongoose";

export const NoticeSchema = new Schema(
    {
        clubname: String,
        heading: String,
        info: String,
        announcelogo: String,
    },
    { timestamps: true }
);