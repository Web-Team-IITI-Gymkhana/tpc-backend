import { Inject, Injectable } from "@nestjs/common";
import { REGISTRATIONS_DAO, SEASON_DAO, STUDENT_DAO } from "src/constants";
import { RegistrationModel, SeasonModel, StudentModel } from "src/db/models";
import { SeasonsQueryDto } from "./dtos/query.dto";
import { FindOptions } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateSeasonsDto } from "./dtos/post.dto";

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

  async createSeasons(seasons: CreateSeasonsDto[]) {
    const createdSeasons = await this.seasonRepo.bulkCreate(seasons);
    const seasonIds = createdSeasons.map((season) => season.id);

    const students = await this.studentRepo.findAll();

    const registrations = [];
    for (const student of students) {
      for (const seasonId of seasonIds) {
        registrations.push({
          studentId: student.id,
          seasonId: seasonId,
          registered: false,
        });
      }
    }
    await this.registrationRepo.bulkCreate(registrations);

    return seasonIds;
  }

  async deleteSeasons(ids: string | string[]) {
    const ans = await this.seasonRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
