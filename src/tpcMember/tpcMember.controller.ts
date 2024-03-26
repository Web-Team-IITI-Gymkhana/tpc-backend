import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { GetTpcMemberQueryDto } from "./dtos/tpcMemberGetQuery.dto";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetTpcMemberReturnDto, GetTpcMembersReturnDto } from "./dtos/tpcMemberGetReturn.dto";
import { ApiFilterQuery, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateTpcMemberDto } from "./dtos/tpcMemberPost.dto";
import { UpdateTpcMemberDto } from "./dtos/tpcMemberPatch.dto";
import { TpcMemberService } from "./tpcMember.service";

@Controller("tpcMembers")
@ApiTags("TPC Member")
export class TpcMemberController {
  constructor(private tpcMemberService: TpcMemberService) {}

  @Get()
  @ApiResponse({ type: GetTpcMembersReturnDto, isArray: true })
  @ApiFilterQuery("q", GetTpcMemberQueryDto)
  async getTpcMembers(@Query("q") where: GetTpcMemberQueryDto) {
    const ans = await this.tpcMemberService.getTpcMembers(where);

    return pipeTransformArray(ans, GetTpcMembersReturnDto);
  }

  @Get("/:id")
  @ApiResponse({ type: GetTpcMemberReturnDto })
  async getTpcMember(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.tpcMemberService.getTpcMember(id);

    return pipeTransform(ans, GetTpcMemberReturnDto);
  }

  @Post()
  @ApiBody({ type: CreateTpcMemberDto, isArray: true })
  @ApiResponse({ type: String, isArray: true, description: "Array of Ids" })
  async createTpcMembers(@Body() body: CreateTpcMemberDto) {
    return "Hello";
  }

  @Patch()
  @ApiBody({ type: UpdateTpcMemberDto, isArray: true })
  async updateTpcMembers(@Body() body: UpdateTpcMemberDto) {
    return "Hello";
  }

  @Delete()
  async deleteTpcMembers(@Query("id") ids: string | string[]) {
    return "Hello";
  }
}
