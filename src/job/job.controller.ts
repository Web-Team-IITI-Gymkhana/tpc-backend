import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { JobService } from "./job.service";
import { GetJobQueryDto } from "./dtos/jobGetQuery.dto";
import { ApiFilterQuery, createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { GetJobReturnDto, GetJobsReturnDto } from "./dtos/jobGetReturn.dto";
import { CreateJobCoordinatorsDto } from "./dtos/jobCreate.dto";
import { UpdateJobDto } from "./dtos/jobUpdate.dto";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("jobs")
@ApiTags("Jobs")
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  @ApiFilterQuery("q", GetJobQueryDto)
  @ApiResponse({ type: GetJobsReturnDto, isArray: true })
  @ApiOperation({ description: "For schema find GetJobsReturnDto. Ctrl+F for it. " })
  async getJobs(@Query("q") where: GetJobQueryDto) {
    const ans = await this.jobService.getJobs(where);

    return pipeTransformArray(ans, GetJobsReturnDto);
  }

  @Get("/:id")
  @ApiResponse({ type: GetJobReturnDto })
  async getJob(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.jobService.getJob(id);

    return pipeTransform(ans, GetJobReturnDto);
  }

  @Post("/:id/assign")
  @ApiBody({ type: CreateJobCoordinatorsDto, isArray: true })
  @ApiResponse({ type: String, isArray: true, description: "Array of ids" })
  async createJobCoordinators(
    @Body(createArrayPipe(CreateJobCoordinatorsDto)) body: CreateJobCoordinatorsDto[],
    @Param("id", new ParseUUIDPipe()) jobId: string
  ) {
    const jobCoordinators = body.map((jobCoordinator) => ({ ...jobCoordinator, jobId: jobId }));
    const ans = await this.jobService.addJobCoordinators(jobCoordinators);

    return ans;
  }

  @Patch()
  @ApiBody({ type: UpdateJobDto, isArray: true })
  async updateJobCoordinators(@Body(createArrayPipe(UpdateJobDto)) jobs: UpdateJobDto[]) {
    const pr = jobs.map((job) => this.jobService.updateJob(job));
    const ans = await Promise.all(pr);

    return ans;
  }

  @Delete()
  @ApiQuery({ type: String, isArray: true })
  async deleteJobs(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.jobService.deleteJobs(pids);

    return ans;
  }

  @Delete("/:id/assign")
  @ApiQuery({ type: String, isArray: true })
  async deleteJobCoordinators(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.jobService.deleteJobCoordinators(pids);

    return ans;
  }
}
