import {
  Controller,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JOB_COORDINATOR_SERVICE } from "src/constants";
import { JobIdParamDto } from "src/dtos/job";
import JobCoordinatorService from "src/services/JobCoordinatorService";
import { JobCoordinator } from "src/entities/JobCoordinator";
import { JobCoordinatorIdParamDto, createJobCoordinatorDto, updateJobCoordinatorDto } from "src/dtos/jobCoordinator";

@Controller("/job/:jobId/coordinators")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class PenaltyController {
  constructor(@Inject(JOB_COORDINATOR_SERVICE) private jobCoordinatorService: JobCoordinatorService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getJobCoordinators(@Param() param: JobIdParamDto) {
    const jobCoordinators = await this.jobCoordinatorService.getJobCoordinators({ jobId: param.jobId });
    return { jobCoordinators: jobCoordinators };
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async createJobCoordinator(@Param() param: JobIdParamDto, @Body() body: createJobCoordinatorDto) {
    const newJobCoordinator = await this.jobCoordinatorService.createJobCoordinator(
      new JobCoordinator({
        jobId: param.jobId,
        tpcMemberId: body.tpcMemberId,
        role: body.role
      })
    );
    return { jobCoordinator: newJobCoordinator };
  }

  @Put("/:jobCoordinatorId")
  @UseInterceptors(ClassSerializerInterceptor)
  async updateJobCoordinator(@Param() param: JobIdParamDto & JobCoordinatorIdParamDto, @Body() body: updateJobCoordinatorDto) {
    const newJobCoordinator = await this.jobCoordinatorService.updateJobCoordinator(param.jobCoordinatorId, body);
    return { jobCoordinator: newJobCoordinator };
  }

  @Delete("/:jobCoordinatorId")
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteJobCoordinator(@Param() param: JobIdParamDto & JobCoordinatorIdParamDto) {
    const deleted = await this.jobCoordinatorService.deleteJobCoordinator(param.jobCoordinatorId);
    return { deleted: deleted };
  }
}
