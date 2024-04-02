import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { GetTpcMemberQueryDto } from "./dtos/tpcMemberGetQuery.dto";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetTpcMemberReturnDto, GetTpcMembersReturnDto } from "./dtos/tpcMemberGetReturn.dto";
import { ApiFilterQuery, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateTpcMemberDto } from "./dtos/tpcMemberPost.dto";
import { UpdateTpcMemberDto } from "./dtos/tpcMemberPatch.dto";
import { TpcMemberService } from "./tpcMember.service";
import { RoleEnum } from "src/enums";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";

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
  async createTpcMembers(
    @Body(new ParseArrayPipe({ items: CreateTpcMemberDto })) body: CreateTpcMemberDto[]
  ): Promise<string[]> {
    const tpcMembers = body.map((data) => {
      data.user.role = RoleEnum.TPC_MEMBER;

      return data;
    });

    const ans = await this.tpcMemberService.createTpcMembers(tpcMembers);

    return ans;
  }

  @Patch()
  @UseInterceptors(TransactionInterceptor)
  @ApiBody({ type: UpdateTpcMemberDto, isArray: true })
  async updateTpcMembers(@Body() body: UpdateTpcMemberDto[], @TransactionParam() t: Transaction) {
    const pr = body.map((data) => this.tpcMemberService.updateTpcMember(data, t));
    const ans = await Promise.all(pr);

    return ans;
  }

  @Delete()
  async deleteTpcMembers(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const pr = pids.map((id) => this.tpcMemberService.deleteTpcMember(id));
    const ans = await Promise.all(pr);

    return ans;
  }
}
