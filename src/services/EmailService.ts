// email.service.ts

import { Global, HttpException, Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { env, IEnvironmentVariables } from "../config";
import { Mail } from "nodemailer/lib/mailer";
import { Address } from "nodemailer/lib/mailer";
import * as fs from "fs";
import * as path from "path";

export class SendEmailDto {
  from?: Address;
  recepients: Address[];
  subject: string;
  html: string;
  text?: string;
  placeholderReplacements?: Record<string, string>;
}

export function getHtmlContent(filePath: string, replacements: { [key: string]: string }): string {
  let html = fs.readFileSync(filePath, "utf8");
  for (const key in replacements) {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
  }

  return html;
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
    const url = `${FRONTEND_URL}/passwordless/${token}`;
    const templatePath = path.resolve(process.cwd(), "src/html", "token.html");
    const replacements = {
      url: url,
    };
    const emailHtmlContent = getHtmlContent(templatePath, replacements);
    const options: Mail.Options = {
      from: {
        name: APP_NAME,
        address: MAIL_USER,
      },
      to: to,
      subject: "token for your login",
      html: emailHtmlContent,
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
