// email.service.ts

import { Global, HttpException, Injectable, Logger } from "@nestjs/common";
import { globalAgent } from "http";
import * as nodemailer from "nodemailer";
import { http } from "winston";
import { env, IEnvironmentVariables } from "src/config";
import { Mail } from "nodemailer/lib/mailer";
import { Address } from "nodemailer/lib/mailer";

export class SendEmailDto {
  from?: Address;
  recepients: Address[];
  subject: string;
  html: string;
  text?: string;
  placeholderReplacements?: Record<string, string>;
}

@Global()
@Injectable()
export class EmailService {
  mailTransport() {
    const environmentVariables: IEnvironmentVariables = env();
    const { MAIL_USER, MAIL_PASSWORD } = environmentVariables;
    const transporter = nodemailer.createTransport({
      service: "gmail",
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
    const { MAIL_USER, APP_NAME } = environmentVariables;

    const transport = this.mailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: APP_NAME,
        address: MAIL_USER,
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
        this.logger.log("Email sent:", info.response);
      }
    });

    return result;
  }
  private logger = new Logger(EmailService.name);

  async sendTokenEmail(to: string, token: string): Promise<boolean> {
    const transport = this.mailTransport();
    const environmentVariables: IEnvironmentVariables = env();
    const { MAIL_USER, APP_NAME, FRONTEND_URL } = environmentVariables;
    const options: Mail.Options = {
      from: {
        name: APP_NAME,
        address: MAIL_USER,
      },
      to: to,
      subject: "token for your login",
      text: `open this link is ${FRONTEND_URL}/passwordless/${token} to login`,
    };

    await transport.sendMail(options, (error, info) => {
      if (error) {
        this.logger.error("Error sending email1:", error);
        throw new HttpException("Error sending email", 500);
      } else {
        this.logger.log("Email sent:", info.response);
      }
    });

    return true;
  }
}
