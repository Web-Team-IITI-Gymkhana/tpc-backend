// email.service.ts

import { Global, Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { env, IEnvironmentVariables } from "../config";
import { Mail } from "nodemailer/lib/mailer";
import { Address } from "nodemailer/lib/mailer";
import * as fs from "fs";
import * as path from "path";

export class SendEmailDto {
  from?: Address;
  recepients: Address[];
  bcc?: Address[];
  cc?: Address[];
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
  private logger = new Logger(EmailService.name);
  private static transporter: nodemailer.Transporter | null = null;

  mailTransport(): nodemailer.Transporter {
    if (EmailService.transporter) {
      return EmailService.transporter;
    }

    const environmentVariables: IEnvironmentVariables = env();
    const { MAIL_USER, MAIL_PASSWORD } = environmentVariables;
    EmailService.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });

    return EmailService.transporter;
  }

  async sendEmail(dto: SendEmailDto) {
    const { from, recepients, bcc, cc, subject, html, attachments } = dto;
    const environmentVariables: IEnvironmentVariables = env();
    const { MAIL_USER, APP_NAME } = environmentVariables;

    const transport = this.mailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: APP_NAME,
        address: MAIL_USER,
      },
      to: recepients,
      bcc,
      cc,
      subject,
      html,
    };

    try {
      const result = await transport.sendMail(options);
      this.logger.log(`Email sent: ${result.response || result.messageId || "success"}`);
      return result;
    } catch (error) {
      this.logger.error("Error sending email:", error);
      return null;
    }
  }

  async sendTokenEmail(to: string, token: string): Promise<boolean> {
    try {
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

      const result = await transport.sendMail(options);
      this.logger.log(`Email sent: ${result.response || result.messageId || "success"}`);
      return true;
    } catch (error) {
      this.logger.error("Error sending token email:", error);
      return false;
    }
  }
}
