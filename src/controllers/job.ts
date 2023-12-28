import {
  Body,
  Controller,
  Inject,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { EVENT_SERVICE, JOB_SERVICE } from "src/constants";
import JobService from "src/services/JobService";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { Job } from "src/entities/Job";
import { Event } from "src/entities/Event";
import { JobStatus } from "src/entities/JobStatus";
import { EventStatus, JobStatusType } from "src/db/enums";
import {
  AddJobDto,
  AddJobEventDto,
  EventIdParamDto,
  GetJobQuery,
  JobIdParamDto,
  UpdateJobDto,
  UpdateJobEventDto,
} from "../dtos/job";
import EventService from "src/services/EventService";
import { queryBuilder } from "src/utils/utils";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("/jobs")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class JobController {
  constructor(
    @Inject(JOB_SERVICE) private jobService: JobService,
    @Inject(EVENT_SERVICE) private eventService: EventService
  ) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addJob(@Body() body: AddJobDto, @TransactionParam() transaction: Transaction) {
    const job = await this.jobService.createJob(
      new Job({
        seasonId: body.seasonId,
        companyId: body.companyId,
        recruiterId: body.recruiterId,
        role: body.role,
        metadata: body.metadata,
        active: false,
      }),
      transaction
    );

    const updatedJob = await this.jobService.upsertJobStatusAndUpdateCurrent(
      new JobStatus({ jobId: job.id, status: JobStatusType.INITIALIZED }),
      transaction
    );
    return { job: updatedJob };
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getJobs(@Query() query: GetJobQuery) {
    const jobs = await this.jobService.getJobs({ ...query });
    return { jobs: jobs };
  }

  @Get("/:jobId")
  @UseInterceptors(ClassSerializerInterceptor)
  async getJob(@Param() param: JobIdParamDto) {
    const [job] = await this.jobService.getJobs({ id: param.jobId });
    if (!job) {
      throw new HttpException(`Job with jobId: ${param.jobId} not found`, HttpStatus.NOT_FOUND);
    }
    return { job: job };
  }

  @Put("/:jobId")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateJob(
    @Param() param: JobIdParamDto,
    @Body() body: UpdateJobDto,
    @TransactionParam() transaction: Transaction
  ) {
    let [job] = await this.jobService.getJobs({ id: param.jobId }, transaction);
    if (!job) {
      throw new HttpException(`Job with jobId: ${param.jobId} not found`, HttpStatus.NOT_FOUND);
    }
    let updatedJob = await this.jobService.updateJob(
      job.id,
      { active: body.active, metadata: body.metadata },
      transaction
    );
    if (body.status) {
      updatedJob = await this.jobService.upsertJobStatusAndUpdateCurrent(
        new JobStatus({ jobId: job.id, status: body.status }),
        transaction
      );
    }
    return { job: updatedJob };
  }

  @Get("/:jobId/events")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async getJobEvents(@Param() param: JobIdParamDto, @TransactionParam() transaction: Transaction) {
    const events = await this.eventService.getEvents({ jobId: param.jobId });
    return { event: events };
  }

  @Post("/:jobId/events")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addJobEvent(
    @Param() param: JobIdParamDto,
    @Body() body: AddJobEventDto,
    @TransactionParam() transaction: Transaction
  ) {
    let status: EventStatus = EventStatus.INITIALIZED;
    if (body.startDateTime && body.endDateTime) {
      status = EventStatus.SCHEDULED;
    }
    const event = await this.eventService.createEvent(
      new Event({
        jobId: param.jobId,
        type: body.type,
        roundNumber: body.roundNumber,
        startDateTime: body.startDateTime,
        endDateTime: body.endDateTime,
        metadata: body.metadata,
        status: status,
      }),
      transaction
    );
    return { event: event };
  }

  @Put("/:jobId/events/:eventId")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateEvent(
    @Param() param: JobIdParamDto & EventIdParamDto,
    @Body() body: UpdateJobEventDto,
    @TransactionParam() transaction: Transaction
  ) {
    let [event] = await this.eventService.getEvents({ id: param.eventId }, transaction);
    if (!event) {
      throw new HttpException(`Event with eventId: ${param.eventId} not found`, HttpStatus.NOT_FOUND);
    }
    const updatedEvent = await this.eventService.updateEvent(event.id, body, transaction);
    return { event: updatedEvent };
  }

  @Delete("/:jobId/events/:eventId")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteEvent(@Param() param: JobIdParamDto & EventIdParamDto, @TransactionParam() transaction: Transaction) {
    const deleted = await this.eventService.deleteEvent(param.eventId, transaction);
    return { deleted: deleted };
  }
}
