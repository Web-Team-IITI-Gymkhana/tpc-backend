import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Get,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JobService } from "./job.service";
import { DeleteValues, GetValue, GetValues, PatchValues } from "src/decorators/controller";
import { JobsQueryDto } from "./dtos/query.dto";
import { GetJobDto, GetJobsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateApplicationDto, CreateJobCoordinatorsDto } from "./dtos/post.dto";
import { UpdateJobsDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { SignedUrlService } from "src/services/SignedUrlService";

@Controller("jobs")
@ApiTags("Job")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class JobController {
  constructor(
    private jobService: JobService,
    private signedUrlService: SignedUrlService
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

  @Get("/jd/:filename/signed-url")
  @ApiResponse({ type: String })
  async getJdSignedUrl(@Param("filename") filename: string) {
    const ans = await this.jobService.getJD(filename);
    if (!ans) throw new NotFoundException(`File ${filename} not found`);

    const signedUrl = this.signedUrlService.generateSignedJdUrl(filename);

    return { url: signedUrl };
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
