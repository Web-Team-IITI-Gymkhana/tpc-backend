import { Body, Controller, Inject, Post, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { RECRUITER_SERVICE } from "src/constants";
import RecruiterService from "src/services/RecruiterService";
import { Recruiter } from "src/entities/Recruiter";
import { AddRecruiterDto } from "../dtos/recruiter";

@Controller("/recruiters")
export class RecruiterController {
  constructor(@Inject(RECRUITER_SERVICE) private recruiterService: RecruiterService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(@Body() body: AddRecruiterDto) {
    const recruiter = await this.recruiterService.createRecruiter(
      new Recruiter({ companyId: body.companyId, userId: body.userId })
    );
    return { recruiter: recruiter };
  }
}
