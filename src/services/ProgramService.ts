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
  async onModuleInit() {
    await this.insertDefaultPrograms();
  }

  private getDefaultPrograms() {
    const programs: Program[] = [];
    for (const year of YEARS) {
      for (const course of Object.keys(COURSE_BRANCH_MAP)) {
        const branches = COURSE_BRANCH_MAP[course];
        for (const branch of branches) {
          programs.push(new Program({ course: course, branch: branch, year: year }));
        }
      }
    }
    return programs;
  }

  async insertDefaultPrograms() {
    const transaction = await this.sequelizeInstance.transaction();
    try {
      await this.createPrograms(this.getDefaultPrograms(), transaction);
      transaction.commit();
    } catch (error) {
      console.log(error);
      transaction.rollback();
    }
  }

  async createPrograms(programs: Program[], t?: Transaction) {
    await this.programRepo.bulkCreate(programs, { transaction: t });
  }

  async getPrograms(where?: WhereOptions<ProgramModel>, t?: Transaction) {
    const programModels = await this.programRepo.findAll({ where: where, transaction: t });
    return programModels.map((programModel) => Program.fromModel(programModel));
  }
}

export default ProgramService;
