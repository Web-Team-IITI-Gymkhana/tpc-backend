import { Body, Controller, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SeasonService } from "./season.service";
import { DeleteValues, GetValues, PostValues } from "src/decorators/controller";
import { SeasonsQueryDto } from "./dtos/query.dto";
import { GetSeasonsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateSeasonsDto } from "./dtos/post.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";

@Controller("seasons")
@ApiTags("Season")
export class SeasonController {
  constructor(private seasonService: SeasonService) {}

  @GetValues(SeasonsQueryDto, GetSeasonsDto)
  async getSeasons(@Query("q") where: SeasonsQueryDto) {
    const ans = await this.seasonService.getSeasons(where);

    return pipeTransformArray(ans, GetSeasonsDto);
  }

  @PostValues(CreateSeasonsDto)
  async createSeasons(@Body(createArrayPipe(CreateSeasonsDto)) seasons: CreateSeasonsDto[]) {
    const ans = await this.seasonService.createSeasons(seasons);

    return ans;
  }

  @DeleteValues()
  async deleteSeasons(@Query() query: DeleteValuesDto) {
    const ans = await this.seasonService.deleteSeasons(query.id);

    return ans;
  }
}
