import {
  Body,
  Controller,
  Inject,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  UseGuards,
} from "@nestjs/common";
import { SEASON_SERVICE } from "src/constants";
import SeasonService from "src/services/SeasonService";
import { Season } from "src/entities/Season";
import { AddSeasonDto } from "../dtos/season";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("/seasons")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class SeasonController {
  constructor(@Inject(SEASON_SERVICE) private seasonService: SeasonService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async addSeason(@Body() body: AddSeasonDto) {
    const season = await this.seasonService.createSeason(new Season({ type: body.type, year: body.year }));
    return { season: season };
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getSeasons() {
    const seasons = await this.seasonService.getSeasons();
    return { seasons: seasons };
  }
}
