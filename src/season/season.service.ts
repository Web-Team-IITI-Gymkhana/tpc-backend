import { Inject, Injectable } from "@nestjs/common";
import { REGISTRATIONS_DAO, SEASON_DAO, STUDENT_DAO } from "src/constants";
import { ProgramModel, RegistrationModel, SeasonModel, StudentModel } from "src/db/models";
import { SeasonsQueryDto } from "./dtos/query.dto";
import { FindOptions } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateSeasonsDto } from "./dtos/post.dto";
import { SeasonTypeEnum } from "src/enums";

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

    const students = await this.studentRepo.findAll({
      include: [
        {
          model: ProgramModel,
          as: "program",
        },
      ],
    });

    const registrations = [];

    for (const season of createdSeasons) {
      const seasonYear = parseInt(season.year, 10);
      if (isNaN(seasonYear)) {
        throw new Error(`Invalid season year: ${season.year}`);
      }

      for (const student of students) {
        const programYear = parseInt(student.program.year, 10);
        if (isNaN(programYear)) {
          throw new Error(`Invalid program year for student ${student.id}: ${student.program.year}`);
        }

        if (
          (season.type === "INTERN" && programYear === seasonYear + 2) ||
          (season.type === "PLACEMENT" && programYear === seasonYear + 1)
        ) {
          registrations.push({
            studentId: student.id,
            seasonId: season.id,
            registered: false,
          });
        }
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
