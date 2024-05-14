import { Inject, Injectable } from "@nestjs/common";
import sequelize from "sequelize";
import { Optional, Transaction } from "sequelize";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { JOB_DAO, PROGRAM_DAO, SALARY_DAO, SEASON_DAO, DUMMY_COMPANY, DUMMY_RECRUITER } from "src/constants";
import { JobModel, ProgramModel, SalaryModel, SeasonModel } from "src/db/models";
import {
  CategoryEnum,
  GenderEnum,
  IndustryDomainEnum,
  InterviewTypesEnum,
  TestTypesEnum,
  CountriesEnum,
} from "src/enums";

@Injectable()
export class JafService {
  constructor(
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel,
    @Inject(PROGRAM_DAO) private programRepo: typeof ProgramModel,
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel
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
      seasons: seasons.map((season) => season.get({ plain: true })),
      programs: programs.map((program) => program.get({ plain: true })),
      genders: Object.values(GenderEnum),
      categories: Object.values(CategoryEnum),
      testTypes: Object.values(TestTypesEnum),
      domains: Object.values(IndustryDomainEnum),
      interviewTypes: Object.values(InterviewTypesEnum),
      countries: Object.values(CountriesEnum),
    };
  }
}
