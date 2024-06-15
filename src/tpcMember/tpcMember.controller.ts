import { Body, Controller, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TpcMemberService } from "./tpcMember.service";
import { DeleteValues, GetValue, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { TpcMembersQueryDto } from "./dtos/query.dto";
import { GetTpcMemberDto, GetTpcMembersDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateTpcMembersDto } from "./dtos/post.dto";
import { UpdateTpcMembersDto } from "./dtos/patch.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { AdminGuard } from "src/auth/adminGaurd";

@Controller("tpc-members")
@ApiTags("TpcMember")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), AdminGuard)
export class TpcMemberController {
  constructor(private tpcMemberService: TpcMemberService) {}

  @GetValues(TpcMembersQueryDto, GetTpcMembersDto)
  async getTpcMembers(@Query("q") where: TpcMembersQueryDto) {
    const ans = await this.tpcMemberService.getTpcMembers(where);

    return pipeTransformArray(ans, GetTpcMembersDto);
  }

  @GetValue(GetTpcMemberDto)
  async getTpcMember(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.tpcMemberService.getTpcMember(id);

    return pipeTransform(ans, GetTpcMemberDto);
  }

  @PostValues(CreateTpcMembersDto)
  async createTpcMembers(@Body(createArrayPipe(CreateTpcMembersDto)) tpcMembers: CreateTpcMembersDto[]) {
    const ans = await this.tpcMemberService.createTpcMembers(tpcMembers);

    return ans;
  }

  @PatchValues(UpdateTpcMembersDto)
  async updateTpcMembers(@Body(createArrayPipe(UpdateTpcMembersDto)) tpcMembers: UpdateTpcMembersDto[]) {
    const pr = tpcMembers.map((tpcMember) => this.tpcMemberService.updateTpcMember(tpcMember));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  async deleteTpcMembers(@Query() query: DeleteValuesDto) {
    const ans = await this.tpcMemberService.deleteTpcMembers(query.id);

    return ans;
  }
}
