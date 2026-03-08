import { Module } from "@nestjs/common";
import { RecruiterFeedbackController } from "./recruiter-feedback.controller";
import { RecruiterFeedbackService } from "./recruiter-feedback.service";
import { EmailService } from "../../services/EmailService";

@Module({
  controllers: [RecruiterFeedbackController],
  providers: [RecruiterFeedbackService, EmailService],
})
export class RecruiterFeedbackModule {}
