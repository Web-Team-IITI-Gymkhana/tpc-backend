import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors } from "@nestjs/common";
import { RecruiterViewService } from "./recruiter-view.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { IUser } from "src/auth/User";
import { User } from "src/decorators/User";
import { pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetEventDto, GetJobDto, GetJobsDto, GetRecruiterDto } from "./dto/get.dto";
import { JobsQueryDto } from "./dto/query.dto";
import { Transaction } from "sequelize";
import { TransactionParam } from "src/decorators/TransactionParam";
import { UpdateFacultyDto } from "src/faculty-view/dto/patch.dto";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { UpdateRecruiterDto } from "./dto/patch.dto";

@Controller("recruiter-view")
@UseGuards(AuthGuard("jwt"))
@ApiTags("recruiter-view")
@ApiBearerAuth("jwt")
export class RecruiterViewController {
  constructor(private readonly recruiterViewService: RecruiterViewService) {}

  @Get("recruiter")
  @ApiResponse({ type: GetRecruiterDto })
  async getRecruiter(@User() user: IUser) {
    const ans = await this.recruiterViewService.getRecruiter(user.recruiterId);

    return pipeTransform(ans, GetRecruiterDto);
  }

  @Get("jobs")
  @ApiResponse({ type: GetJobsDto, isArray: true })
  async getJobs(@Query("q") where: JobsQueryDto, @User() user: IUser) {
    const ans = await this.recruiterViewService.getJobs(where, user.recruiterId);

    return pipeTransformArray(ans, GetJobsDto);
  }

  @Get("jobs/:id")
  @ApiResponse({ type: GetJobDto })
  async getJob(@Param("id") id: string, @User() user: IUser) {
    const ans = await this.recruiterViewService.getJob(id, user.recruiterId);

    return pipeTransform(ans, GetJobDto);
  }

  @Get("events/:id")
  @ApiResponse({ type: GetEventDto })
  async getEvent(@Param("id") id: string, @User() user: IUser) {
    const ans = await this.recruiterViewService.getEvent(id, user.recruiterId);

    return pipeTransform(ans, GetEventDto);
  }

  @Patch("recruiter")
  @UseInterceptors(TransactionInterceptor)
  async updateFaculty(@Body() recruiter: UpdateRecruiterDto, @TransactionParam() t: Transaction, @User() user: IUser) {
    return await this.recruiterViewService.updateRecruiter(recruiter, user.recruiterId, t);
  }
}
