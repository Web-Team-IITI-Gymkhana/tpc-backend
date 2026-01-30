import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { AdminFeedbackService } from "./admin-feedback.service";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { FeedbackQueryDto } from "./dtos/query.dto";

@Controller("admin/feedback")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.ADMIN))
export class AdminFeedbackController {
  constructor(private readonly service: AdminFeedbackService) {}

  @Get()
  async getAllFeedbacks(@Query() query: FeedbackQueryDto) {
    return this.service.getAllFeedbacks(query);
  }

  @Get(":id")
  async getFeedback(@Param("id") id: string) {
    return this.service.getFeedbackById(id);
  }
}
