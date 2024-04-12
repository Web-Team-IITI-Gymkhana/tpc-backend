import { Body, Controller, Delete, Get, ParseArrayPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PenaltyService } from "./penalty.service";
import { ApiFilterQuery, pipeTransformArray } from "src/utils/utils";
import { GetPenaltyQueryDto } from "./dtos/query.dto";
import { CreatePenaltyDto } from "./dtos/post.dto";
import { GetPenaltiesReturnDto } from "./dtos/get.dto";

@Controller("penalties")
@ApiTags("Penalty")
export class PenaltyController {
  constructor(private penaltyService: PenaltyService) {}

  @Get()
  @ApiFilterQuery("q", GetPenaltyQueryDto)
  @ApiResponse({ type: GetPenaltiesReturnDto, isArray: true })
  @ApiOperation({ description: "Refer to GetPenaltyQueryDto for schema. Ctrl+F it for more details" })
  async getPenalties(@Query("q") where: GetPenaltyQueryDto) {
    const ans = await this.penaltyService.getPenalties(where);

    return pipeTransformArray(ans, GetPenaltiesReturnDto);
  }

  @Post()
  @ApiBody({ type: CreatePenaltyDto, isArray: true })
  @ApiResponse({ type: String, isArray: true, description: "Array of UUIDS" })
  async createPenalties(@Body(new ParseArrayPipe({ items: CreatePenaltyDto })) penalties: CreatePenaltyDto[]) {
    const ans = await this.penaltyService.createPenalties(penalties);

    return ans;
  }

  @Delete()
  async deletePenalties(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.penaltyService.deletePenalties(pids);

    return ans;
  }
}
