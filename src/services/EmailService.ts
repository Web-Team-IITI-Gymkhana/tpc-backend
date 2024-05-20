/* eslint-disable no-console */
// email.service.ts

import { Global, HttpException, Injectable, Logger } from "@nestjs/common";
import { globalAgent } from "http";
const nodemailer = require("nodemailer");
import { http } from "winston";
import { env, IEnvironmentVariables } from "src/config";
import { Mail } from "nodemailer/lib/mailer";
import { Address } from "nodemailer/lib/mailer";

export type SendEmailDto = {
  from?: Address;
  recepients: Address[];
  subject: string;
  html: string;
  text?: string;
  placeholderReplacements?: Record<string, string>;
};

@Global()
@Injectable()
export class EmailService {
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

    const result = await transport.sendMail(options, (error, info) => {
      if (error) {
        this.logger.error("Error sending email1:", error);
        throw new HttpException("Error sending email", 500);
      } else {
        this.logger.log("Email sent1:", info.response);
      }
    });

    return result;
  }
  private logger = new Logger(EmailService.name);

  async sendTokenEmail(to: string, token: string): Promise<boolean> {
    const transport = this.mailTransport();
    const environmentVariables: IEnvironmentVariables = env();
    const { DEFAULT_MAIL_FROM, APP_NAME } = environmentVariables;
    const options: Mail.Options = {
      from: {
        name: APP_NAME,
        address: DEFAULT_MAIL_FROM,
      },
      to: to,
      // to: "me210003016@iiti.ac.in", // Put your email address for testing
      subject: "token for your login",
      text: `your token is ${token} and will be sent on ${to}`,
    };

    await transport.sendMail(options, (error, info) => {
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
