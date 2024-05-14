import { Body, Controller, Delete, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JobService } from "./job.service";
import { DeleteValues, GetValue, GetValues, PatchValues } from "src/decorators/controller";
import { JobsQueryDto } from "./dtos/query.dto";
import { GetJobDto, GetJobsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateJobCoordinatorsDto } from "./dtos/post.dto";
import { UpdateJobsDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";

@Controller("jobs")
@ApiTags("Job")
export class JobController {
  constructor(private jobService: JobService) {}

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
