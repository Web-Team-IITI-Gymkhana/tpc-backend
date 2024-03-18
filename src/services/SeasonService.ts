import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction, WhereOptions } from "sequelize";
import { SEASON_DAO } from "src/constants";
import { SeasonModel } from "src/db/models";
import { Season } from "src/entities/Season";

@Injectable()
class SeasonService {
  private logger = new Logger(SeasonService.name);

  constructor(@Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel) {}

  async createSeason(season: Season, t?: Transaction) {
    const seasonModel = await this.seasonRepo.create(season, { transaction: t });

    return Season.fromModel(seasonModel);
  }

  async getSeasons(where?: WhereOptions<SeasonModel>, t?: Transaction) {
    const seasonModels = await this.seasonRepo.findAll({ where: where, transaction: t });

    return seasonModels.map((seasonModel) => Season.fromModel(seasonModel));
  }

  async deleteSeason(seasonId: string, t?: Transaction) {
    await this.seasonRepo.destroy({ where: { id: seasonId }, transaction: t });
  }
}

export default SeasonService;
