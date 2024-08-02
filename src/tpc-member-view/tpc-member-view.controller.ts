import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe } from "@nestjs/common";
import { TpcMemberViewService } from "./tpc-member-view.service";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { pipeTransform, pipeTransformArray } from "src/utils/utils";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";
import { GetJobDto, GetJobsDto, GetTpcMemberDto } from "./dto/get.dto";
import { JobsQueryDto } from "src/job/dtos/query.dto";
import { UpdateJobsDto } from "./dto/patch.dto";
import { ApplicationsQueryDto, EventsQueryDto } from "src/event/dtos/query.dto";
import { GetEventDto, GetEventsDto } from "src/event/dtos/get.dto";

@Controller("tpc-member-view")
@ApiTags("TpcMemberView")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
export class TpcMemberViewController {
  constructor(private readonly tpcMemberViewService: TpcMemberViewService) {}

  @Get()
  @ApiResponse({ type: GetTpcMemberDto })
  async GetMember(@User() user: IUser) {
    const ans = await this.tpcMemberViewService.getTpcMember(user.tpcMemberId);

    return pipeTransform(ans, GetTpcMemberDto);
  }

  @Get("jobs")
  @ApiResponse({ type: GetJobsDto, isArray: true })
  async GetJobs(@Query("q") where: JobsQueryDto, @User() user: IUser) {
    const ans = await this.tpcMemberViewService.getJobs(where, user.tpcMemberId);

    return pipeTransformArray(ans, GetJobsDto);
  }

  @Get("jobs/:id")
  @ApiResponse({ type: GetJobDto })
  async GetJob(@Param("id", new ParseUUIDPipe()) id: string, @User() user: IUser) {
    const ans = await this.tpcMemberViewService.getJob(id, user.tpcMemberId);

    return pipeTransform(ans, GetJobDto);
  }

  @Get("events")
  @ApiResponse({ type: GetEventsDto, isArray: true })
  async GetEvents(@Query("q") where: EventsQueryDto, @User() user: IUser) {
    const ans = await this.tpcMemberViewService.getEvents(where, user.tpcMemberId);

    return pipeTransformArray(ans, GetEventsDto);
  }

  @Get("events/:id")
  @ApiResponse({ type: GetEventDto })
  async GetEvent(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Query("q") where: ApplicationsQueryDto,
    @User() user: IUser
  ) {
    const ans = await this.tpcMemberViewService.getEvent(id, where, user.tpcMemberId);

    return pipeTransform(ans, GetEventDto);
  }

  @Patch("jobs/:id")
  async updateJob(@Param("id") id: string, @User() user: IUser, @Body() job: UpdateJobsDto) {
    return await this.tpcMemberViewService.updateJob(job, id, user.tpcMemberId);
  }
}
