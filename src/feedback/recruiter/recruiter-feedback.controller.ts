import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { RecruiterFeedbackService } from "./recruiter-feedback.service";
import { CreateRecruiterFeedbackDto } from "./dtos/post.dto";
import { RecruiterFeedbackSeasonDto } from "./dtos/get.dto";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";

@Controller("recruiter-feedback")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.RECRUITER))
export class RecruiterFeedbackController {
  constructor(private readonly service: RecruiterFeedbackService) {}

  // ---------------- POST FEEDBACK ----------------
  @Post()
  async submitFeedback(
    @Body() body: CreateRecruiterFeedbackDto,
    @User() user: IUser,
  ) {
    await this.service.submitFeedback(body, user.id);
    return { success: true };
  }

  // ---------------- GET SEASONS ----------------
  @Get("seasons")
  async getRecruiterSeasons(
    @User() user: IUser,
  ): Promise<RecruiterFeedbackSeasonDto[]> {
    return this.service.getRecruiterFeedbackSeasons(user.id);
  }
}
