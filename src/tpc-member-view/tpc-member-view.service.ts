import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JOB_DAO, TPC_MEMBER_DAO } from "src/constants";
import {
  CompanyModel,
  EventModel,
  JobCoordinatorModel,
  JobModel,
  RecruiterModel,
  SalaryModel,
  SeasonModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { FindOptions } from "sequelize";
import { JobsQueryDto } from "src/job/dtos/query.dto";
import { parsePagesize, parseFilter, parseOrder } from "src/utils";
import { Op } from "sequelize";
import { UpdateJobsDto } from "./dto/patch.dto";

@Injectable()
export class TpcMemberViewService {
  constructor(
    @Inject(TPC_MEMBER_DAO) private tpcMemberRepo: typeof TpcMemberModel,
    @Inject(JOB_DAO) private jobRepo: typeof JobModel
  ) {}

  async getTpcMember(id: string) {
    const ans = await this.tpcMemberRepo.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    if (!ans) throw new NotFoundException(`The Tpc Member with id ${id} does not exist`);

    return ans.get({ plain: true });
  }

  async getJobs(where: JobsQueryDto, tpcMemberId: string) {
    const findOptions: FindOptions<JobModel> = {
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
          required: true,
          where: {
            tpcMemberId: tpcMemberId,
          },
        },
        {
          model: RecruiterModel,
          as: "recruiter",
          required: true,
          include: [
            {
              model: UserModel,
              as: "user",
            },
          ],
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

  async getJob(id: string, tpcMemberId: string) {
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
          model: RecruiterModel,
          as: "recruiter",
          include: [
            {
              model: UserModel,
              as: "user",
            },
          ],
        },
        {
          model: JobCoordinatorModel,
          as: "jobCoordinators",
          where: {
            tpcMemberId: {
              [Op.eq]: tpcMemberId,
            },
          },
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
        },
        {
          model: SalaryModel,
          as: "salaries",
        },
      ],
    });

    if (!ans) throw new UnauthorizedException(`The Job with id: ${id} does not exist`);

    return ans.get({ plain: true });
  }

  async updateJob(job: UpdateJobsDto, jobId: string, tpcMemberId: string) {
    const jobExists = await this.jobRepo.findOne({
      where: { id: jobId },
      include: [
        {
          model: JobCoordinatorModel,
          as: "jobCoordinators",
          where: { tpcMemberId: tpcMemberId },
        },
      ],
    });

    if (!jobExists) {
      throw new UnauthorizedException(`Unauthorized`);
    }

    const [affectedRows] = await this.jobRepo.update(job, { where: { id: jobId } });

    return affectedRows > 0 ? [] : [jobId];
  }
}
