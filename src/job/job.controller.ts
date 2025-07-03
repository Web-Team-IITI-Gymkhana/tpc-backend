import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  StreamableFile,
  UseGuards, 
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JobService } from "./job.service";
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
import { verifyRecaptcha } from "src/utils/recaptcha"; 

@Controller("jobs")
@ApiTags("Job")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class JobController {
  JDFolder = JD_FOLDER;
  constructor(
    private jobService: JobService,
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
  async deleteJobs(@Query() query: DeleteValuesDto) {
    const ans = await this.jobService.deleteJobs(query.id);

    return ans;
  }

  @Delete("/coordinators")
  @ApiQuery({ name: "id", type: String, isArray: true })
  @ApiResponse({ type: Number })
  async deleteJobCoordinators(@Query() query: DeleteValuesDto) {
    const ans = await this.jobService.deleteJobCoordinators(query.id);

    return ans;
  }
}
