import { Inject, Injectable } from "@nestjs/common";
import { SEASON_DAO } from "src/constants";
import { SeasonModel } from "src/db/models";
import { SeasonsQueryDto } from "./dtos/query.dto";
import { FindOptions } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateSeasonsDto } from "./dtos/post.dto";

@Injectable()
export class SeasonService {
  constructor(@Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel) {}

  async getSeasons(where: SeasonsQueryDto) {
    const findOptions: FindOptions<SeasonModel> = {};

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.seasonRepo.findAll(findOptions);

    return ans.map((season) => season.get({ plain: true }));
  }

  async createSeasons(seasons: CreateSeasonsDto[]) {
    const ans = await this.seasonRepo.bulkCreate(seasons);

    return ans.map((season) => season.id);
  }

  async deleteSeasons(ids: string | string[]) {
    const ans = await this.seasonRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
