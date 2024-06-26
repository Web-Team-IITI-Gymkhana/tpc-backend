import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  Res,
  NotFoundException,
  StreamableFile,
} from "@nestjs/common";
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
import { UpdateJobDto, UpdateRecruiterDto, UpdateSalariesDto } from "./dto/patch.dto";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { GetFile } from "src/decorators/controller";
import { RESUME_FOLDER } from "src/constants";
import { Response } from "express";
import { FileService } from "src/services/FileService";
import path from "path";

@Controller("recruiter-view")
@ApiTags("recruiter-view")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.RECRUITER))
export class RecruiterViewController {
  folderName = RESUME_FOLDER;

  constructor(
    private readonly recruiterViewService: RecruiterViewService,
    private fileService: FileService
  ) {}

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

  @Patch("jobs/:id")
  async updateJob(@Param("id") id: string, @User() user: IUser, @Body() job: UpdateJobDto) {
    return await this.recruiterViewService.updateJob(job, id, user.recruiterId);
  }

  @Patch("salary/:id")
  async updateSalary(@Param("id") id: string, @User() user: IUser, @Body() salary: UpdateSalariesDto) {
    return await this.recruiterViewService.updateSalary(salary, id, user.recruiterId);
  }

  @Get("events/:id")
  @ApiResponse({ type: GetEventDto })
  async getEvent(@Param("id") id: string, @User() user: IUser) {
    const ans = await this.recruiterViewService.getEvent(id, user.recruiterId);

    return pipeTransform(ans, GetEventDto);
  }

  @GetFile(["application/pdf"], "resume")
  async getResume(@Param("filename") filename: string, @User() user: IUser, @Res({ passthrough: true }) res: Response) {
    const ans = await this.recruiterViewService.getResume(filename, user.recruiterId);
    if (ans.length === 0) throw new NotFoundException(`Resume with filename ${filename} not found`);
    const file = this.fileService.getFile(path.join(this.folderName, filename));
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(file);
  }

  @Patch("recruiter")
  @UseInterceptors(TransactionInterceptor)
  async updateFaculty(@Body() recruiter: UpdateRecruiterDto, @TransactionParam() t: Transaction, @User() user: IUser) {
    return await this.recruiterViewService.updateRecruiter(recruiter, user.recruiterId, t);
  }
}
