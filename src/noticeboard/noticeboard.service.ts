import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as nodemailer from "nodemailer";

@Injectable()
export class NoticeboardService {
    constructor(
        @InjectModel("Announce") private model: Model<any>
    ) { }

    async createAnnouncement(data: any) {
        const newAnnounce = new this.model(data);
        const saved = await newAnnounce.save();

        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.iiti.ac.in",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMIAL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const predefinedGroups = {
                // Here we need to add the emails of the students in the respective groups
                none: [],
                all: ["all@iiti.ac.in"],
                cse: ["cse1@iiti.ac.in", "cse2@iiti.ac.in"],
                ece: ["ece1@iiti.ac.in"]
            };

            let finalEmails: string[] = [];

            // from dropdown
            if (data.group && predefinedGroups[data.group]) {
                finalEmails = [...predefinedGroups[data.group]];
            }

            // from manual input
            if (data.emails && data.emails.length > 0) {
                finalEmails = [...finalEmails, ...data.emails];
            }

            // remove duplicates
            finalEmails = [...new Set(finalEmails)];

            if (finalEmails.length === 0) return saved;

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                bcc: finalEmails.join(","),
                subject: `${data.heading}`,
                html: `
                    <h2>${data.heading}</h2>
                    <p>${data.info}</p>
                    <p>${data.clubname}</p>
                    <img src="cid:logo" style="max-width:200px; margin-top:10px;" />
                `,
                attachments: [
                    {
                        filename: "logo.png",
                        content: data.announcelogo.split("base64,")[1],
                        encoding: "base64",
                        cid: "logo",
                    },
                ],
            });

        } catch (err) {
            console.error("Email failed:", err);
        }

        return saved;
    }

    async getAnnouncements() {
        return this.model.find().sort({ createdAt: -1 });
    }
}