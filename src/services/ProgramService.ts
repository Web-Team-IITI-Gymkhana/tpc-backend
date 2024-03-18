import { Inject, Injectable, Logger } from "@nestjs/common";
import { Sequelize, Transaction, WhereOptions } from "sequelize";
import { COURSE_BRANCH_MAP, PROGRAM_DAO, SEQUELIZE_DAO, YEARS } from "src/constants";
import { ProgramModel } from "src/db/models";
import { Program } from "src/entities/Program";

@Injectable()
class ProgramService {
  private logger = new Logger(ProgramService.name);

  constructor(
    @Inject(SEQUELIZE_DAO)
    private readonly sequelizeInstance: Sequelize,
    @Inject(PROGRAM_DAO) private programRepo: typeof ProgramModel
  ) {}

  async createPrograms(programs: Program[], t?: Transaction) {
    await this.programRepo.bulkCreate(programs, { updateOnDuplicate: ["branch", "year", "course"], transaction: t });
  }

  async getPrograms(where?: WhereOptions<ProgramModel>, t?: Transaction) {
    const programModels = await this.programRepo.findAll({ where: where, transaction: t });

    return programModels.map((programModel) => Program.fromModel(programModel));
  }
}

export default ProgramService;
