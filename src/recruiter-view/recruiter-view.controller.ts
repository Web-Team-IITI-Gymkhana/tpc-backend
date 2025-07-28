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
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { RecruiterViewService } from "./recruiter-view.service";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody } from "@nestjs/swagger";
import { IUser } from "src/auth/User";
import { User } from "src/decorators/User";
import { pipeTransform, pipeTransformArray, createArrayPipe } from "src/utils/utils";
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
import { JD_FOLDER, JD_SIZE_LIMIT, RESUME_FOLDER } from "src/constants";
import { Response } from "express";
import { FileService } from "src/services/FileService";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { GetJafValuesDto, JafDto } from "src/job/dtos/jaf.dto";
import { PostFeedbackdto } from "./dto/post.dto";
import { verifyRecaptcha } from "src/utils/recaptcha";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";

@Controller("recruiter-view")
@ApiTags("recruiter-view")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.RECRUITER))
export class RecruiterViewController {
  folderName = RESUME_FOLDER;
  JDFolder = JD_FOLDER;

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
  async updateFaculty(
    @Body() recruiter: UpdateRecruiterDto,

    @TransactionParam() t: Transaction,
    @User() user: IUser
  ) {
    return await this.recruiterViewService.updateRecruiter(recruiter, user.recruiterId, t);
  }

  @Get("jaf")
  @ApiResponse({ type: GetJafValuesDto })
  async getJafDetails() {
    const ans = await this.recruiterViewService.getJafDetails();

    return pipeTransform(ans, GetJafValuesDto);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 60 * 1000 } })
  @Post("jaf")
  @ApiResponse({ type: String })
  @UseInterceptors(TransactionInterceptor)
  async createJaf(
    @Body() jaf: JafDto & { captchaToken?: string },
    @TransactionParam() t: Transaction,
    @User() user: IUser
  ) {
    const verified = await verifyRecaptcha(jaf.captchaToken);
    if (!verified) {
      throw new ForbiddenException("Invalid captcha");
    }

    const attachments = jaf.job.attachments || [];
    const uploadedFiles = [];

    for (const base64String of attachments) {
      const base64Data = base64String.startsWith("data:application/pdf;base64,")
        ? base64String.slice("data:application/pdf;base64,".length)
        : base64String;

      const file = base64Data ? { buffer: Buffer.from(base64Data, "base64"), size: 0 } : undefined;
      if (file) {
        file.size = file.buffer.length;
        const magic = file.buffer.subarray(0, 4).toString("ascii");
        if (magic !== "%PDF") throw new BadRequestException("Only PDF is supported");
        if (file.size > JD_SIZE_LIMIT) throw new BadRequestException("File size too large");
        const filename = uuidv4() + ".pdf";
        uploadedFiles.push(filename);

        await this.fileService.uploadFile(path.join(this.JDFolder, filename), file);
      }
    }

    jaf.job.attachments = uploadedFiles;
    const ans = await this.recruiterViewService.createJaf(jaf.job, jaf.salaries, t, user.recruiterId);

    return ans;
  }

  @GetFile(["application/pdf"], "jd")
  async getJd(@Param("filename") filename: string, @Res({ passthrough: true }) res: Response, @User() user: IUser) {
    const ans = await this.recruiterViewService.getJD(filename, user.recruiterId);
    if (!ans) throw new NotFoundException(`File ${filename} not found`);
    const file = this.fileService.getFile(path.join(this.JDFolder, filename));
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(file);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 50, ttl: 60 * 1000 } })
  @Post("/feedbacks")
  @ApiBody({ type: PostFeedbackdto, isArray: true })
  @ApiResponse({ type: String, isArray: true })
  async createfeedbacks(@Body(createArrayPipe(PostFeedbackdto)) feedbacks: PostFeedbackdto[], @User() user: IUser) {
    const ans = await this.recruiterViewService.postFeedback(feedbacks, user.recruiterId);

    return ans;
  }
}
