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
import { EVENT_SERVICE, FACULTY_APPROVAL_REQUEST_SERVICE, JOB_SERVICE } from "src/constants";
import JobService from "src/services/JobService";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { Job } from "src/entities/Job";
import { Event } from "src/entities/Event";
import { FacultyApprovalRequest } from "src/entities/FacultyApprovalRequest";
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
  FacultyApprovalRequestIdParamDto,
  UpdateJobFacultyApprovalRequestDto,
  GetJobFacultyApprovalRequestQuery,
  CreateJobFacultyApprovalRequestsDto,
} from "../dtos/job";
import EventService from "src/services/EventService";
import { queryBuilder } from "src/utils/utils";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import FacultyApprovalRequestService from "src/services/FacultyApprovalRequest";

@Controller("/jobs")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class JobController {
  constructor(
    @Inject(JOB_SERVICE) private jobService: JobService,
    @Inject(EVENT_SERVICE) private eventService: EventService,
    @Inject(FACULTY_APPROVAL_REQUEST_SERVICE) private facultyApprovalRequestService: FacultyApprovalRequestService
  ) {}

  // @Post()
  // @UseInterceptors(TransactionInterceptor)
  // @UseInterceptors(ClassSerializerInterceptor)
  // async addJob(@Body() body: AddJobDto, @TransactionParam() transaction: Transaction) {
  //   const job = await this.jobService.createJob(
  //     new Job({
        
  //     }),
  //     transaction
  //   );

  //   const updatedJob = await this.jobService.upsertJobStatusAndUpdateCurrent(
  //     new JobStatus({ jobId: job.id, status: JobStatusType.INITIALIZED }),
  //     transaction
  //   );
  //   return { job: updatedJob };
  // }

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

  @Delete("/:jobId")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteJob(@Param() param: JobIdParamDto, @TransactionParam() transaction: Transaction) {
    const deleted = await this.jobService.deleteJob(param.jobId, transaction);
    return { deleted: deleted };
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

  @Put("/events/:eventId")
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

  @Delete("/events/:eventId")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteEvent(@Param() param: JobIdParamDto & EventIdParamDto, @TransactionParam() transaction: Transaction) {
    const deleted = await this.eventService.deleteEvent(param.eventId, transaction);
    return { deleted: deleted };
  }

  @Get("/:jobId/facultyApprovalRequest")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async getJobFacultyApprovalRequests(
    @Param() param: JobIdParamDto,
    @Query() query: GetJobFacultyApprovalRequestQuery,
    @TransactionParam() transaction: Transaction
  ) {
    const facultyApprovalRequests = await this.facultyApprovalRequestService.getFacultyApprovalRequests({
      id: query.id,
      jobId: param.jobId,
      facultyId: query.facultyId,
    });
    return { facultyApprovalRequests: facultyApprovalRequests };
  }

  @Post("/:jobId/facultyApprovalRequest")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addJobFacultyApprovalRequest(
    @Param() param: JobIdParamDto,
    @Body() body: CreateJobFacultyApprovalRequestsDto,
    @TransactionParam() transaction: Transaction
  ) {
    const [job] = await this.jobService.getJobs({
      id: param.jobId,
    });
    if (!job) {
      throw new HttpException(`job with jobId: ${param.jobId} not found`, HttpStatus.NOT_FOUND);
    }
    const promises = [];
    for (const facultyApprovalRequest of body.facultyApprovalRequests) {
      promises.push(
        await this.facultyApprovalRequestService.createOrGetFacultyApprovalRequest(
          new FacultyApprovalRequest({
            jobId: param.jobId,
            facultyId: facultyApprovalRequest.facultyId,
            approved: false,
            remarks: facultyApprovalRequest.remarks,
          }),
          transaction
        )
      );
    }
    const facultyApprovalRequests = await Promise.all(promises);
    return { facultyApprovalRequests: facultyApprovalRequests };
  }

  @Put("/facultyApprovalRequest/:facultyApprovalRequestId")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateFacultyApprovalRequest(
    @Param() param: JobIdParamDto & FacultyApprovalRequestIdParamDto,
    @Body() body: UpdateJobFacultyApprovalRequestDto,
    @TransactionParam() transaction: Transaction
  ) {
    let [facultyApprovalRequest] = await this.facultyApprovalRequestService.getFacultyApprovalRequests(
      { id: param.facultyApprovalRequestId },
      transaction
    );
    if (!facultyApprovalRequest) {
      throw new HttpException(
        `FacultyApprovalRequest with facultyApprovalRequestId: ${param.facultyApprovalRequestId} not found`,
        HttpStatus.NOT_FOUND
      );
    }
    const updatedFacultyApprovalRequest = await this.facultyApprovalRequestService.updateFacultyApprovalRequest(
      facultyApprovalRequest.id,
      body,
      transaction
    );
    return { facultyApprovalRequest: updatedFacultyApprovalRequest };
  }

  @Delete("/facultyApprovalRequest/:facultyApprovalRequestId")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteFacultyApprovalRequest(
    @Param() param: JobIdParamDto & FacultyApprovalRequestIdParamDto,
    @TransactionParam() transaction: Transaction
  ) {
    const deleted = await this.facultyApprovalRequestService.deleteFacultyApprovalRequest(
      param.facultyApprovalRequestId,
      transaction
    );
    return { deleted: deleted };
  }
}
