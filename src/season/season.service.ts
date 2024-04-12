import { Injectable, Inject } from "@nestjs/common";
import { SEASON_DAO } from "src/constants";
import { SeasonModel } from "src/db/models";

@Injectable()
export class SeasonService {
  constructor(@Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel) {}

  async getSeasons() {
    const ans = await this.seasonRepo.findAll();

    return ans.map((season) => season.get({ plain: true }));
  }

  async createSeasons(seasons) {
    const ans = await this.seasonRepo.bulkCreate(seasons);

    return ans.map((season) => season.id);
  }

  async deleteSeasons(ids: string[]) {
    const ans = await this.seasonRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
