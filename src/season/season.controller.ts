import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { SeasonService } from "./season.service";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { SeasonReturnDto } from "./dtos/get.dto";
import { CreateSeasonDto } from "./dtos/post.dto";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("seasons")
@ApiTags("Season")
export class SeasonController {
  constructor(private seasonService: SeasonService) {}

  @Get()
  @ApiResponse({ type: SeasonReturnDto, isArray: true })
  async getSeasons() {
    const ans = await this.seasonService.getSeasons();

    return pipeTransformArray(ans, SeasonReturnDto);
  }

  @Post()
  @ApiBody({ type: CreateSeasonDto, isArray: true })
  async createSeasons(@Body(createArrayPipe(CreateSeasonDto)) seasons: CreateSeasonDto[]) {
    const ans = await this.seasonService.createSeasons(seasons);

    return ans;
  }

  @Delete()
  async deleteSeasons(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.seasonService.deleteSeasons(pids);

    return ans;
  }
}
