import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import {
  COMPANY_DAO,
  EVENT_DAO,
  FEEDBACK_DAO,
  JOB_DAO,
  PROGRAM_DAO,
  RECRUITER_DAO,
  SALARY_DAO,
  SEASON_DAO,
  USER_DAO,
} from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  JobCoordinatorModel,
  JobModel,
  ProgramModel,
  RecruiterModel,
  ResumeModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { FindOptions, Op, Optional, Transaction } from "sequelize";
import { JobsQueryDto } from "./dto/query.dto";
import {
  CategoryEnum,
  CountriesEnum,
  GenderEnum,
  IndustryDomainEnum,
  InterviewTypesEnum,
  TestTypesEnum,
} from "src/enums";
import { UpdateJobDto, UpdateRecruiterDto, UpdateSalariesDto } from "./dto/patch.dto";
import { omit } from "lodash";
import sequelize from "sequelize";
import { NullishPropertiesOf } from "sequelize/types/utils";
import { FeedbackModel } from "src/db/models/FeedbackModel";
import { PostFeedbackdto } from "./dto/post.dto";

@Injectable()
export class RecruiterViewService {
  constructor(
    @Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel,
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(SALARY_DAO) private salaryRepo: typeof SalaryModel,
    @Inject(EVENT_DAO) private eventRepo: typeof EventModel,
    @Inject(COMPANY_DAO) private companyRepo: typeof CompanyModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel,
    @Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel,
    @Inject(FEEDBACK_DAO) private feedbackRepo: typeof FeedbackModel,
    @Inject(PROGRAM_DAO) private programRepo: typeof ProgramModel
  ) {}

  async getRecruiter(recruiterId: string) {
    const ans = await this.recruiterRepo.findByPk(recruiterId, {
      include: [
        {
          model: UserModel,
          as: "user",
          required: true,
        },
        {
          model: CompanyModel,
          as: "company",
          required: true,
        },
      ],
    });
    if (!ans) throw new UnauthorizedException(`Recruiter with id ${recruiterId} not found`);

    return ans.get({ plain: true });
  }

  async getJobs(where: JobsQueryDto, recruiterId: string) {
    const findOptions: FindOptions<JobModel> = {
      where: {
        recruiterId: recruiterId,
      },
      include: [
        {
          model: SeasonModel,
          as: "season",
        },
        {
          model: CompanyModel,
          as: "company",
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.jobRepo.findAll(findOptions);

    return ans.map((job) => job.get({ plain: true }));
  }

  async getJob(id: string, recruiterId: string) {
    const ans = await this.jobRepo.findOne({
      where: {
        id: id,
        recruiterId: recruiterId,
      },
      include: [
        {
          model: SeasonModel,
          as: "season",
        },
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: JobCoordinatorModel,
          as: "jobCoordinators",
          include: [
            {
              model: TpcMemberModel,
              as: "tpcMember",
              include: [
                {
                  model: StudentModel,
                  as: "student",
                  include: [
                    {
                      model: UserModel,
                      as: "user",
                    },
                    {
                      model: ProgramModel,
                      as: "program",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: EventModel,
          as: "events",
          where: {
            visibleToRecruiter: true,
          },
          required: false,
        },
        {
          model: SalaryModel,
          as: "salaries",
        },
      ],
    });

    if (!ans) throw new UnauthorizedException(`Unauthorized`);

    return ans.get({ plain: true });
  }

  async getEvent(eventId: string, recruiterId: string) {
    const ans = await this.eventRepo.findOne({
      where: {
        id: eventId,
        visibleToRecruiter: true,
      },
      include: [
        {
          model: ApplicationModel,
          as: "applications",
          include: [
            {
              model: ResumeModel,
              as: "resume",
              required: true,
            },
            {
              model: StudentModel,
              as: "student",
              include: [
                {
                  model: UserModel,
                  as: "user",
                },
                {
                  model: ProgramModel,
                  as: "program",
                },
              ],
            },
          ],
        },
        {
          model: JobModel,
          as: "job",
          required: true,
          where: {
            recruiterId: recruiterId,
          },
        },
      ],
    });

    if (!ans) throw new UnauthorizedException(`Unauthorized`);

    return ans.get({ plain: true });
  }

  async getResume(filename: string, recruiterId: string) {
    const ans = await this.eventRepo.findAll({
      include: [
        {
          model: ApplicationModel,
          as: "applications",
          required: true,
          include: [
            {
              model: ResumeModel,
              as: "resume",
              required: true,
              where: { filepath: filename },
            },
          ],
        },
        {
          model: JobModel,
          as: "job",
          required: true,
          where: {
            recruiterId: recruiterId,
          },
        },
      ],
    });

    if (!ans) throw new UnauthorizedException(`Unauthorized`);

    return ans.map((event) => event.get({ plain: true }));
  }

  async postFeedback(feedbacks: PostFeedbackdto[], recruiterId: string) {
    const eligibleJobIdsData = await this.jobRepo.findAll({
      where: {
        recruiterId: recruiterId,
      },
      attributes: ["id"],
    });

    const eligibleJobIds = eligibleJobIdsData.map((job) => job.id);

    const filteredFeedbacks = feedbacks.filter((feedback) => eligibleJobIds.includes(feedback.jobId));

    const ans = await this.feedbackRepo.bulkCreate(filteredFeedbacks);

    if (!ans) throw new UnauthorizedException(`Unauthorized`);

    return ans.map((feedback) => feedback.id);
  }

  async getEnums() {
    return {
      Domain: Object.values(IndustryDomainEnum),
      Category: Object.values(CategoryEnum),
    };
  }

  async updateRecruiter(recruiter: UpdateRecruiterDto, recruiterId: string, t: Transaction) {
    const recruiterUpdatePromise = this.recruiterRepo.update(omit(recruiter, "user", "company"), {
      where: { id: recruiterId },
      transaction: t,
    });

    const userUpdatePromise = recruiter.user
      ? this.userRepo.update(recruiter.user, {
          where: sequelize.literal(`"id" IN (SELECT "userId" FROM "Recruiter" WHERE "id" = '${recruiterId}')`),
          transaction: t,
        })
      : Promise.resolve([0]);

    const companyUpdatePromise = recruiter.company
      ? this.companyRepo.update(recruiter.company, {
          where: sequelize.literal(`"id" IN (SELECT "companyId" FROM "Recruiter" WHERE "id" = '${recruiterId}')`),
          transaction: t,
        })
      : Promise.resolve([0]);

    const [recruiterUpdateResult, userUpdateResult, companyUpdateResult] = await Promise.all([
      recruiterUpdatePromise,
      userUpdatePromise,
      companyUpdatePromise,
    ]);

    const [recruiterUpdateCount] = recruiterUpdateResult;
    const [userUpdateCount] = userUpdateResult;
    const [companyUpdateCount] = companyUpdateResult;

    return recruiterUpdateCount > 0 || userUpdateCount > 0 || companyUpdateCount > 0 ? [] : [recruiterId];
  }

  async updateJob(job: UpdateJobDto, jobId: string, recruiterId: string) {
    const [ans] = await this.jobRepo.update(job, {
      where: { id: jobId, recruiterId: recruiterId, active: false },
    });
    if (ans == 0) throw new UnauthorizedException(`Unauthorized`);

    return ans > 0 ? [] : [jobId];
  }

  async updateSalary(salary: UpdateSalariesDto, salaryId: string, recruiterId: string) {
    const subQuery = {
      [Op.in]: sequelize.literal(
        `(SELECT "id" FROM "Job" WHERE "recruiterId" = '${recruiterId}' AND "active" = false)`
      ),
    };

    const [ans] = await this.salaryRepo.update(salary, {
      where: {
        id: salaryId,
        jobId: subQuery,
      },
    });

    if (ans == 0) throw new UnauthorizedException(`Unauthorized`);

    return ans > 0 ? [] : [salaryId];
  }

  async createJaf(
    jaf: Optional<JobModel, NullishPropertiesOf<JobModel>>,
    salaries: Optional<SalaryModel, NullishPropertiesOf<SalaryModel>>[],
    t: Transaction,
    recruiterId: string
  ) {
    const recruiter = await this.recruiterRepo.findByPk(recruiterId, {
      include: [
        {
          model: CompanyModel,
          as: "company",
        },
      ],
    });

    jaf.recruiterId = recruiter.id;
    jaf.companyId = recruiter.company.id;

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
