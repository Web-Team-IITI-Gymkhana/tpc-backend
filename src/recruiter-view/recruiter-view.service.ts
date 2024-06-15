import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { COMPANY_DAO, EVENT_DAO, JOB_DAO, RECRUITER_DAO, USER_DAO } from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  JobCoordinatorModel,
  JobModel,
  RecruiterModel,
  ResumeModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { FindOptions, Transaction } from "sequelize";
import { JobsQueryDto } from "./dto/query.dto";
import { CategoryEnum, IndustryDomainEnum } from "src/enums";
import { UpdateRecruiterDto } from "./dto/patch.dto";
import { omit } from "lodash";
import sequelize from "sequelize";

@Injectable()
export class RecruiterViewService {
  constructor(
    @Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel,
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(EVENT_DAO) private eventRepo: typeof EventModel,
    @Inject(COMPANY_DAO) private companyRepo: typeof CompanyModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
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
    const ans = await this.jobRepo.findByPk(id, {
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
                  model: UserModel,
                  as: "user",
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

    if (ans.recruiterId !== recruiterId) {
      throw new UnauthorizedException(`Unauthorized`);
    }

    return ans.get({ plain: true });
  }

  async getEvent(eventId: string, recruiterId: string) {
    const ans = await this.eventRepo.findByPk(eventId, {
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
            },
          ],
        },
        {
          model: JobModel,
          as: "job",
        },
      ],
    });

    if (!ans) throw new UnauthorizedException(`Unauthorized`);

    if (ans.job.recruiterId !== recruiterId || ans.visibleToRecruiter === false) {
      throw new UnauthorizedException(`Unauthorized`);
    }

    return ans.get({ plain: true });
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
}
