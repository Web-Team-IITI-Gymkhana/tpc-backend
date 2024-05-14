import { Inject, Injectable, NotFoundException } from "@nestjs/common";
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
import { JobsQueryDto } from "./dtos/query.dto";
import { FindOptions, Op, Transaction } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateJobCoordinatorsDto } from "./dtos/post.dto";
import { UpdateJobsDto } from "./dtos/patch.dto";

@Injectable()
export class JobService {
  constructor(
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(JOB_COORDINATOR_DAO) private jobCoordinatorRepo: typeof JobCoordinatorModel
  ) {}

  async getJobs(where: JobsQueryDto) {
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

  async getJob(id: string) {
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

    if (!ans) throw new NotFoundException(`The Job with id: ${id} does not exist`);

    return ans.get({ plain: true });
  }

  async createJobCoordinators(jobCoordinators: CreateJobCoordinatorsDto[]) {
    const ans = await this.jobCoordinatorRepo.bulkCreate(jobCoordinators);

    return ans.map((jobCoordinator) => jobCoordinator.id);
  }

  async updateJob(job: UpdateJobsDto) {
    const [ans] = await this.jobRepo.update(job, { where: { id: job.id } });

    return ans > 0 ? [] : [job.id];
  }

  async deleteJobs(ids: string | string[]) {
    const ans = await this.jobRepo.destroy({ where: { id: ids } });

    return ans;
  }

  async deleteJobCoordinators(ids: string | string[]) {
    const ans = await this.jobCoordinatorRepo.destroy({ where: { id: ids } });

    return ans;
  }

  async addAttachment(body: { filename: string; jobId: string }, t: Transaction) {
    const [ans] = await this.jobRepo.update(
      { attachment: body.filename },
      { where: { id: body.jobId, attachment: { [Op.is]: null } }, transaction: t }
    );
    if (ans === 0) throw new NotFoundException(`The Job with id: ${body.jobId} does not exist or already has a JD`);

    return ans;
  }

  async deleteAttachments(filenames: string | string[], t: Transaction) {
    const ans = await this.jobRepo.update({ attachment: null }, { where: { attachment: filenames }, transaction: t });

    return ans;
  }
}
