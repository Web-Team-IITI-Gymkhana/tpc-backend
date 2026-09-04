import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JobService } from "./job.service";
import { JobExportService } from "./job-export.service";
import { DeleteValues, GetFile, GetValue, GetValues, PatchValues } from "src/decorators/controller";
import { JobsQueryDto } from "./dtos/query.dto";
import { GetJobDto, GetJobsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateApplicationDto, CreateJobCoordinatorsDto } from "./dtos/post.dto";
import { UpdateJobsDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { Response } from "express";
import path from "path";
import { FileService } from "src/services/FileService";
import { JD_FOLDER } from "src/constants";

@Controller("jobs")
@ApiTags("Job")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class JobController {
  JDFolder = JD_FOLDER;
  constructor(
    private jobService: JobService,
    private jobExportService: JobExportService,
    private fileService: FileService
  ) {}

  @GetValues(JobsQueryDto, GetJobsDto)
  async getJobs(@Query("q") where: JobsQueryDto) {
    const ans = await this.jobService.getJobs(where);

    return pipeTransformArray(ans, GetJobsDto);
  }

  @GetValue(GetJobDto)
  async getJob(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.jobService.getJob(id);

    return pipeTransform(ans, GetJobDto);
  }

  @Post("/coordinators")
  @ApiBody({ type: CreateJobCoordinatorsDto, isArray: true })
  @ApiResponse({ type: String, isArray: true })
  async createJobCoordinators(
    @Body(createArrayPipe(CreateJobCoordinatorsDto)) jobCoordinators: CreateJobCoordinatorsDto[]
  ) {
    const ans = await this.jobService.createJobCoordinators(jobCoordinators);

    return ans;
  }

  @Post("/applications")
  @ApiBody({ type: CreateApplicationDto, isArray: true })
  @ApiResponse({ type: String, isArray: true })
  async createApplications(@Body(createArrayPipe(CreateApplicationDto)) body: CreateApplicationDto[]) {
    const ans = await this.jobService.createApplication(body);

    return ans;
  }

  @GetFile(["application/pdf"], "jd")
  async getJd(@Param("filename") filename: string, @Res({ passthrough: true }) res: Response) {
    const ans = await this.jobService.getJD(filename);
    if (!ans) throw new NotFoundException(`File ${filename} not found`);
    const file = this.fileService.getFile(path.join(this.JDFolder, filename));
    res.setHeader("Content-Type", "application/pdf");

    return new StreamableFile(file);
  }

  @PatchValues(UpdateJobsDto)
  async updateJobs(@Body(createArrayPipe(UpdateJobsDto)) jobs: UpdateJobsDto[]) {
    const pr = jobs.map((job) => this.jobService.updateJob(job));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  @UseGuards(new RoleGuard(RoleEnum.ADMIN))
  async deleteJobs(@Query() query: DeleteValuesDto) {
    const ans = await this.jobService.deleteJobs(query.id);

    return ans;
  }

  @Delete("/coordinators")
  @UseGuards(new RoleGuard(RoleEnum.ADMIN))
  @ApiQuery({ name: "id", type: String, isArray: true })
  @ApiResponse({ type: Number })
  async deleteJobCoordinators(@Query() query: DeleteValuesDto) {
    const ans = await this.jobService.deleteJobCoordinators(query.id);

    return ans;
  }

  @Get("/:id/export")
  @UseGuards(new RoleGuard(RoleEnum.ADMIN))
  async exportJobDetails(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Query("format") format: "csv" | "pdf",
    @Query("sendEmail") sendEmail: string,
    @Query("email") email: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response
  ) {
    const targetFormat = format === "pdf" ? "pdf" : "csv";
    const jobData = await this.jobExportService.fetchJobCompleteDetails(id);
    const company = jobData.job?.company?.name?.replace(/[^a-zA-Z0-9_-]/g, "_") || "Job";
    const role = jobData.job?.role?.replace(/[^a-zA-Z0-9_-]/g, "_") || "Details";
    const filename = `${company}_${role}_details.${targetFormat}`;

    let buffer: Buffer;
    if (targetFormat === "pdf") {
      buffer = await this.jobExportService.generateLatexPdf(jobData);
    } else {
      const csvString = this.jobExportService.generateSingleCsv(jobData);
      buffer = Buffer.from(csvString, "utf-8");
    }

    if (sendEmail === "true") {
      const userEmail = email || req.user?.email;
      if (!userEmail) {
        throw new NotFoundException("User email not found for email delivery");
      }
      await this.jobExportService.sendExportEmail(userEmail, jobData, targetFormat, buffer, filename);
      return { message: `Job details export sent successfully to ${userEmail}` };
    }

    const contentType = targetFormat === "pdf" ? "application/pdf" : "text/csv";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return new StreamableFile(buffer);
  }
}
