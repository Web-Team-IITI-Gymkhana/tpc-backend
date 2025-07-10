import { Inject, Injectable } from "@nestjs/common";
import { REGISTRATIONS_DAO, SEASON_DAO, STUDENT_DAO } from "src/constants";
import { ProgramModel, RegistrationModel, SeasonModel, StudentModel } from "src/db/models";
import { SeasonsQueryDto } from "./dtos/query.dto";
import { FindOptions, Transaction } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateSeasonsDto } from "./dtos/post.dto";
import { SeasonTypeEnum } from "src/enums";
import { UpdateSeasonsDto } from "./dtos/patch.dto";

@Injectable()
export class SeasonService {
  constructor(
    @Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel,
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(REGISTRATIONS_DAO) private registrationRepo: typeof RegistrationModel
  ) {}

  async getSeasons(where: SeasonsQueryDto) {
    const findOptions: FindOptions<SeasonModel> = {};

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.seasonRepo.findAll(findOptions);

    return ans.map((season) => season.get({ plain: true }));
  }

  async createSeasons(seasons: CreateSeasonsDto[], t?: Transaction) {
    const createdSeasons = await this.seasonRepo.bulkCreate(seasons, { transaction: t });
    const seasonIds = createdSeasons.map((season) => season.id);

    return seasonIds;
  }

  async updateSeasons(season: UpdateSeasonsDto) {
    const [ans] = await this.seasonRepo.update(season, {
      where: { id: season.id },
    });

    return ans > 0 ? [] : [season.id];
  }

  async deleteSeasons(ids: string | string[]) {
    const ans = await this.seasonRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
