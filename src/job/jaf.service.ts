import { Inject, Injectable } from "@nestjs/common";
import { Optional, Sequelize, Transaction } from "sequelize";
import { NullishPropertiesOf } from "sequelize/types/utils";
import {
  JOB_DAO,
  PROGRAM_DAO,
  SALARY_DAO,
  SEASON_DAO,
  SEQUELIZE_DAO,
  DUMMY_COMPANY,
  DUMMY_RECRUITER,
} from "src/constants";
import { JobModel, ProgramModel, SalaryModel, SeasonModel } from "src/db/models";
import { CategoryEnum, GenderEnum } from "src/enums";
import { CountriesEnum } from "src/enums/Country.enum";
import { IndustryDomainEnum } from "src/enums/industryDomains.enum";
import { InterviewTypesEnum } from "src/enums/interviewTypes.enum";
import { TestTypesEnum } from "src/enums/testTypes.enum";

@Injectable()
export class JafService {
  constructor(
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel,
    @Inject(PROGRAM_DAO) private programRepo: typeof ProgramModel,
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel,
    @Inject(SEQUELIZE_DAO) private sequelizeInstance: Sequelize
  ) {}

  async createJaf(
    jaf: Optional<JobModel, NullishPropertiesOf<JobModel>>,
    salaries: Optional<SalaryModel, NullishPropertiesOf<SalaryModel>>[],
    t: Transaction
  ) {
    jaf.companyId = DUMMY_COMPANY.id;
    jaf.recruiterId = DUMMY_RECRUITER.id;

    const ans = await this.jobRepo.create(jaf, {
      transaction: t,
    });
    const salariesWithJobId = salaries.map((salary) => ({ ...salary, jobId: ans.id }));
    await this.salaryRepo.bulkCreate(salariesWithJobId, {
      transaction: t,
    });

    return ans.id;
  }

  async getJafDetails() {
    const [seasons, programs] = await Promise.all([this.seasonRepo.findAll(), this.programRepo.findAll()]);

    return {
      seasons: seasons,
      programs: programs,
      genders: Object.values(GenderEnum),
      categories: Object.values(CategoryEnum),
      testTypes: Object.values(TestTypesEnum),
      domains: Object.values(IndustryDomainEnum),
      interviewTypes: Object.values(InterviewTypesEnum),
      countries: Object.values(CountriesEnum),
    };
  }
}
