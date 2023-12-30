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
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JOB_COORDINATOR_SERVICE } from "src/constants";
import { JobIdParamDto } from "src/dtos/job";
import JobCoordinatorService from "src/services/JobCoordinatorService";
import { JobCoordinator } from "src/entities/JobCoordinator";
import { CreateJobCoordinatorsDto, JobCoordinatorIdParamDto, UpdateJobCoordinatorDto } from "src/dtos/jobCoordinator";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { UpdateOrFind } from "src/utils/utils";

@Controller("/job/:jobId/coordinators")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class JobCoordinatorController {
  constructor(@Inject(JOB_COORDINATOR_SERVICE) private jobCoordinatorService: JobCoordinatorService) { }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getJobCoordinators(@Param() param: JobIdParamDto) {
    const jobCoordinators = await this.jobCoordinatorService.getJobCoordinators({ jobId: param.jobId });
    return { jobCoordinators: jobCoordinators };
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async createJobCoordinators(@Param() param: JobIdParamDto, @Body() body: CreateJobCoordinatorsDto, @TransactionParam() transaction: Transaction) {
    const promises = [];
    for (const jobCoordinator of body.jobCoordinators) {
      promises.push(
        this.jobCoordinatorService.createOrGetJobCoordinator(
          new JobCoordinator({
            jobId: param.jobId,
            tpcMemberId: jobCoordinator.tpcMemberId,
            role: jobCoordinator.role
          }),
          transaction
        )
      );
    }
    const jobCoordinators = await Promise.all(promises);
    return { jobCoordinators: jobCoordinators };
  }

  @Put("/:jobCoordinatorId")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(TransactionInterceptor)
  async updateJobCoordinator(
    @Param() param: JobIdParamDto & JobCoordinatorIdParamDto,
    @Body() body: UpdateJobCoordinatorDto,
    @TransactionParam() transaction: Transaction) {
    const [jobCoordinator] = await this.jobCoordinatorService.getJobCoordinators({
      id: param.jobCoordinatorId,
    });
    if (!jobCoordinator) {
      throw new HttpException(`jobCoordinator with jobCoordinatorId: ${param.jobCoordinatorId} not found`, HttpStatus.NOT_FOUND);
    }

    const newJobCoordinator = await UpdateOrFind(
      param.jobCoordinatorId,
      body,
      this.jobCoordinatorService,
      "updateJobCoordinator",
      "getJobCoordinators",
      transaction
    );
    return { jobCoordinator: newJobCoordinator };
  }

  @Delete("/:jobCoordinatorId")
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteJobCoordinator(@Param() param: JobIdParamDto & JobCoordinatorIdParamDto) {
    const [jobCoordinator] = await this.jobCoordinatorService.getJobCoordinators({
      id: param.jobCoordinatorId,
    });
    if (!jobCoordinator) {
      throw new HttpException(`jobCoordinator with jobCoordinatorId: ${param.jobCoordinatorId} not found`, HttpStatus.NOT_FOUND);
    }
    const deleted = await this.jobCoordinatorService.deleteJobCoordinator(param.jobCoordinatorId);
    return { deleted: deleted };
  }
}
