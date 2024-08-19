import { Body, Controller, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SeasonService } from "./season.service";
import { DeleteValues, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { SeasonsQueryDto } from "./dtos/query.dto";
import { GetSeasonsDto } from "./dtos/get.dto";
import { createArrayPipe, pipeTransformArray } from "src/utils/utils";
import { CreateSeasonsDto } from "./dtos/post.dto";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/auth/roleGaurd";
import { RoleEnum } from "src/enums";
import { UpdateSeasonsDto } from "./dtos/patch.dto";

@Controller("seasons")
@ApiTags("Season")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"), new RoleGuard(RoleEnum.TPC_MEMBER))
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

  @PatchValues(UpdateSeasonsDto)
  async updateSeasons(@Body(createArrayPipe(UpdateSeasonsDto)) seasons: UpdateSeasonsDto[]) {
    const pr = seasons.map((season) => this.seasonService.updateSeasons(season));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  async deleteSeasons(@Query() query: DeleteValuesDto) {
    const ans = await this.seasonService.deleteSeasons(query.id);

    return ans;
  }
}
