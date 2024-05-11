import { Controller, Post } from "@nestjs/common";
import { MailerService } from "./mailer.service";
import { SendEmailDto } from "./mail.interface";

@Controller("mailer")
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post("/sendemail")
  async sendMail() {
    const dto: SendEmailDto = {
      recepients: [{ address: "me210003016@iiti.ac.in" }],
      subject: "Test email",
      html: "<p>Hi john, this is a test email</p>",
    };

    return await this.mailerService.sendEmail(dto);
  }
}
