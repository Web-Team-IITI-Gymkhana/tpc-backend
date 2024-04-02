import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { FindOptions, Transaction } from "sequelize";
import { JOB_DAO, SEASON_DAO, STUDENT_DAO, USER_DAO } from "src/constants";
import {
  CompanyModel,
  EventModel,
  FacultyApprovalRequestModel,
  FacultyModel,
  JobCoordinatorModel,
  JobModel,
  PenaltyModel,
  ProgramModel,
  RecruiterModel,
  ResumeModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { parsePagesize, parseFilter, parseOrder } from "src/utils";
import { GetJobQueryDto } from "./dtos/jobGetQuery.dto";

@Injectable()
export class JobService {
  constructor(@Inject(JOB_DAO) private jobRepo: typeof JobModel) {}

  async getJobs(where: GetJobQueryDto) {
    // eslint-disable-next-line prefer-const
    let findOptions: FindOptions<JobModel> = {
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

    // Add page size options
    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    // Apply filter
    parseFilter(findOptions, where.filterBy || {});
    // Apply order
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
        },
        {
          model: SalaryModel,
          as: "salaries",
        },
        {
          model: EventModel,
          as: "events",
        },
        {
          model: FacultyApprovalRequestModel,
          as: "facultyApprovalRequests",
          include: [
            {
              model: FacultyModel,
              as: "faculty",
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
      ],
    });

    if (!ans) throw new NotFoundException(`The Job with id: ${id} Not Found`);
    const res: JobModel = ans.get({ plain: true });

    return res;
  }

  async updateJob(job, t: Transaction) {
    const ans = await this.jobRepo.findByPk(job.id);
    if (!ans) throw new NotFoundException(`No Job with id: ${job.id} Found`);

    await this.jobRepo.update(job, {
      where: { id: ans.id },
      transaction: t,
    });

    return true;
  }

  async deleteJobs(pids: string[], t: Transaction) {
    return await this.jobRepo.destroy({
      where: { id: pids },
      transaction: t,
    });
  }
}
