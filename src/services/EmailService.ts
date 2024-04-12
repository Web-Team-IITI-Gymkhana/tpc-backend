// email.service.ts

import { Global, HttpException, Injectable, Logger } from "@nestjs/common";
import { globalAgent } from "http";
import * as nodemailer from "nodemailer";
import { http } from "winston";

@Global()
@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "manasw649@gmail.com",
      pass: "teip bqxo gxkg gwkw",
    },
  });
  private logger = new Logger(EmailService.name);

  async sendEmail(to: string, token: string): Promise<boolean> {
    const mailOptions = {
      from: "manasw649@gmail.com",
      to,
      subject: "token for your login",
      text: `your token is ${token}`,
    };

    await this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        this.logger.error("Error sending email1:", error);
        throw new HttpException("Error sending email", 500);
      } else {
        this.logger.log("Email sent1:", info.response);
      }
    });

    return true;
  }
}
