import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { GetTpcMemberQueryDto } from "./dtos/tpcMemberGetQuery.dto";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetTpcMemberReturnDto, GetTpcMembersReturnDto } from "./dtos/tpcMemberGetReturn.dto";
import { ApiFilterQuery } from "src/utils/utils";
import { CreateTpcMemberDto } from "./dtos/tpcMemberPost.dto";
import { UpdateTpcMemberDto } from "./dtos/tpcMemberPatch.dto";

@Controller("tpcMembers")
@ApiTags("TPC Member")
export class TpcMemberController {
  constructor() {}

  @Get()
  @ApiResponse({ type: GetTpcMembersReturnDto, isArray: true })
  @ApiFilterQuery("q", GetTpcMemberQueryDto)
  async getTpcMembers(@Query("q") where: GetTpcMemberQueryDto) {
    return "Hello";
  }

  @Get("/:id")
  @ApiResponse({ type: GetTpcMemberReturnDto })
  async getTpcMember(@Param("id") id: string) {
    return "Hello";
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
