import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { TpcMemberViewService } from "./tpc-member-view.service";
import { UpdateTpcMemberViewDto } from "./dto/update-tpc-member-view.dto";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { pipeTransform } from "src/utils/utils";
import { User } from "src/decorators/User";
import { IUser } from "src/auth/User";
import { GetTpcMemberDto } from "./dto/get.dto";

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
}
