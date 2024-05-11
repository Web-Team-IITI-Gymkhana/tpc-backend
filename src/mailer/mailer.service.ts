/* eslint-disable no-console */
import { Injectable } from "@nestjs/common";
const nodemailer = require("nodemailer");
import { env, IEnvironmentVariables } from "src/config";
import { SendEmailDto } from "./mail.interface";
import { Mail } from "nodemailer/lib/mailer";
import { log } from "console";

@Injectable()
export class MailerService {
  mailTransport() {
    const environmentVariables: IEnvironmentVariables = env();
    const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } = environmentVariables;
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });

    return transporter;
  }

  async sendEmail(dto: SendEmailDto) {
    const { from, recepients, subject, html, placeholderReplacements } = dto;
    const environmentVariables: IEnvironmentVariables = env();
    const { DEFAULT_MAIL_FROM, APP_NAME } = environmentVariables;

    const transport = this.mailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: APP_NAME,
        address: DEFAULT_MAIL_FROM,
      },
      to: recepients,
      subject,
      html,
    };

    try {
      const result = await transport.sendMail(options);

      return result;
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}
