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

@Controller("tpc-member-view")
@ApiTags("TpcMemberView")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
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
}
