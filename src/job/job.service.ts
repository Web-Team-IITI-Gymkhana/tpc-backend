import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { JOB_COORDINATOR_DAO, JOB_DAO } from "src/constants";
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
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class JobService {
  constructor(
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(JOB_COORDINATOR_DAO) private jobCoordinatorRepo: typeof JobCoordinatorModel
  ) {}

  async getJobs(where) {
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
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);

    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.jobRepo.findAll(findOptions);

    return ans.map((job) => job.get({ plain: true }));
  }

  async getJob(id: string) {
    const ans = await this.jobRepo.findByPk(id, {
      include: [
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
          model: SalaryModel,
          as: "salaries",
        },
        {
          model: EventModel,
          as: "events",
        },
      ],
    });
    if (!ans) throw new NotFoundException(`The Job with id: ${id} Not Found`);

    return ans.get({ plain: true });
  }

  async updateJob(job) {
    const id = job.id;
    const ans = await this.jobRepo.findByPk(id);

    if (!ans) throw new NotFoundException(`The Job with id: ${id} not found`);

    const res = await this.jobRepo.update(job, { where: { id: id } });

    return true;
  }

  async addJobCoordinators(jobCoordinators) {
    const ans = await this.jobCoordinatorRepo.bulkCreate(jobCoordinators);

    return ans.map((jobCoordinator) => jobCoordinator.id);
  }

  async deleteJobs(ids: string[]) {
    const ans = await this.jobRepo.destroy({ where: { id: ids } });

    return ans;
  }

  async deleteJobCoordinators(ids: string[]) {
    const ans = await this.jobCoordinatorRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
