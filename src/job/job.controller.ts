import {
  Controller,
  Get,
  Query,
  Post,
  Patch,
  Delete,
  Param,
  ParseUUIDPipe,
  ParseArrayPipe,
  Body,
  UseInterceptors,
} from "@nestjs/common";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction, json } from "sequelize";
import { QueryInterceptor } from "src/interceptor/QueryInterceptor";
import { ApiFilterQuery, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { ApiBody, ApiExtraModels, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JobService } from "./job.service";
import { GetJobQueryDto } from "./dtos/jobGetQuery.dto";
import { GetStudentQueryDto } from "src/student/dtos/studentGetQuery.dto";
import { GetJobReturnDto, GetJobsReturnDto } from "./dtos/jobGetReturn.dto";
import { UpdateJobDto } from "./dtos/jobUpdate.dto";

@Controller("jobs")
@ApiTags("Job")
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  @ApiFilterQuery("q", GetJobQueryDto)
  @ApiResponse({ type: GetJobsReturnDto, isArray: true })
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

  /*
   *   @Get("/assign")
   *   @ApiResponse({ type: json })
   *   async ListTPCCordinators(@Param("id", new ParseUUIDPipe()) id: string) {
   *     const ans = await this.jobService.assignCoordinator(id);
   *
   *     return ans;
   *   }
   */

  @Patch()
  @UseInterceptors(TransactionInterceptor)
  @ApiBody({ type: UpdateJobDto, isArray: true })
  async updateStudents(
    @Body(new ParseArrayPipe({ items: UpdateJobDto })) body: UpdateJobDto[],
    @TransactionParam() t: Transaction
  ) {
    const pr = body.map((data) => this.jobService.updateJob(data, t));
    const ans = await Promise.all(pr);

    return ans;
  }

  @Delete()
  @ApiQuery({ name: "id", type: String, isArray: true })
  @UseInterceptors(TransactionInterceptor)
  async deleteStudents(@Query("id") ids: string | string[], @TransactionParam() t: Transaction) {
    const pids = typeof ids === "string" ? [ids] : ids;

    return await this.jobService.deleteJobs(pids, t);
  }
}
