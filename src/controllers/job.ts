import {
  Controller,
  Inject,
  Get,
  UseInterceptors,
  Query,
  UseGuards,
  ParseArrayPipe,
  Param,
  ValidationPipe,
  Body,
  Post,
  Patch,
  Delete,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";
import { JOB_SERVICE } from "src/constants";
import { JobService } from "src/services/JobService";
import { QueryInterceptor } from "src/interceptor/QueryInterceptor";
import { CompanyModel, JobModel, JobStatusModel, SeasonModel } from "src/db/models";
import { conformToModel, find_order, makeFilter, optionsFactory } from "src/utils/utils";
import { GetJobReturnDto, GetJobsReturnDto, UpdateJobDto, WhereOptionsDto } from "src/dtos/job";
import { CreateJobCoordinatorDto } from "src/dtos/jobCoordinator";
import { RemoveNullValidationPipe } from "src/interceptor/RemoveNullPipe";

@Controller("/jobs")
@ApiBearerAuth("jwt")
// @UseGuards(AuthGuard("jwt"))
export class JobController {
  constructor(@Inject(JOB_SERVICE) private jobService: JobService) {}

  @Get()
  @UseInterceptors(QueryInterceptor)
  async getJobs(@Query() where: WhereOptionsDto) {
    console.log(where);
    const models = [JobModel, SeasonModel, JobStatusModel, CompanyModel];
    const alias = ["", "season", "currentStatus", "company"];
    const filterBy = where.filterBy || {};
    const orders = where.orderBy || {};
    const options = optionsFactory(where.from, where.to);
    const filters = [];

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      filters.push(makeFilter(conformToModel(filterBy, model, i == 0)));
      const orderBy = conformToModel(orders, model, i == 0);
      if (Object.keys(orderBy).length) {
        const res = find_order(orderBy, model);
        options["order"] = [[{ model: model, as: alias[i] }, res[0], res[1]]];
      }
    }

    if (options["order"] && options["order"][0][0]["as"] == "")
      options["order"][0] = [options["order"][0][1], options["order"][0][2]];

    const ans = await this.jobService.getJobs(filters, options);
    const pipe = new ParseArrayPipe({
      whitelist: true,
      items: GetJobsReturnDto,
    });

    return pipe.transform(ans, {
      type: "body",
    });
  }

  @Get("/:id")
  async getJob(@Param("id") id: string) {
    const ans = await this.jobService.getJob(id);
    const pipe = new RemoveNullValidationPipe({
      whitelist: true,
      expectedType: GetJobReturnDto,
    });

    return pipe.transform(ans, {
      type: "body",
    });
    // return ans;
  }

  //Why when :id exists?
  @Get("/:id/assign")
  async getJobCoordinators() {}

  @Post("/:id/assign")
  async createCoordinators(
    @Body(new ParseArrayPipe({ items: CreateJobCoordinatorDto })) body: CreateJobCoordinatorDto[],
    @Param("id") jobId: string
  ): Promise<Array<string>> {
    const coordinators = [];
    for (const coordinator of body) {
      coordinator.jobId = jobId;
      coordinators.push(coordinator);
    }
    const ans = await this.jobService.createCoordinators(coordinators);

    return ans;
  }

  @Patch()
  @ApiBody({ type: UpdateJobDto, isArray: true })
  @ApiResponse({ status: 200, type: UpdateJobDto, isArray: true })
  async updateJobs(@Body(new ParseArrayPipe({ items: UpdateJobDto })) body: UpdateJobDto[]): Promise<UpdateJobDto[]> {
    const ans = await this.jobService.updateJobs(body);
    const pipe = new ParseArrayPipe({
      whitelist: true,
      items: UpdateJobDto,
    });

    return pipe.transform(ans, {
      type: "body",
    });
  }

  @Delete()
  async deleteJobs(@Query("id", new ParseArrayPipe({ items: String })) ids: string[]) {
    const ans = await this.jobService.deleteJobs(ids);

    return ans;
  }

  @Delete(":id/assign")
  async deleteJobCordinators(@Query("id", new ParseArrayPipe({ items: String })) ids: string[]) {
    const ans = await this.jobService.deleteJobCordinators(ids);

    return ans;
  }
}
