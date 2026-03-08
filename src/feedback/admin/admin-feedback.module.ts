import { Module } from "@nestjs/common";
import { AdminFeedbackController } from "./admin-feedback.controller";
import { AdminFeedbackService } from "./admin-feedback.service";

@Module({
  controllers: [AdminFeedbackController],
  providers: [AdminFeedbackService],
})
export class AdminFeedbackModule {}
