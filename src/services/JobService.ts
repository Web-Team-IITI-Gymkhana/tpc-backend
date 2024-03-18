import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { JOB_COORDINATOR_DAO, JOB_DAO } from "src/constants";
import {
  CompanyModel,
  FacultyApprovalRequestModel,
  FacultyModel,
  JobCoordinatorModel,
  JobModel,
  JobStatusModel,
  RecruiterModel,
  SeasonModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";
import { UpdateJobDto } from "src/dtos/job";
import { Job } from "src/entities/Job";

@Injectable()
export class JobService {
  constructor(
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(JOB_COORDINATOR_DAO) private jobCoordinatorRepo: typeof JobModel
  ) {}

  async getJobs(filters, options): Promise<Job[]> {
    const restrictions = {
      where: filters[0],
      include: [
        {
          model: SeasonModel,
          as: "season",
          where: filters[1],
          required: true,
        },
        /*
         * {
         *     model: JobStatusModel,
         *     as: 'currentStatus',
         *     where: filters[2],
         *     required: true,
         * },
         */
        {
          model: CompanyModel,
          as: "company",
          where: filters[3],
          required: true,
        },
      ],
    };
    Object.assign(restrictions, options);

    const jobs = await this.jobRepo.findAll(restrictions);

    return jobs.map((job) => Job.fromModel(job));
  }

  async getJob(id: string): Promise<Job> {
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
          model: JobStatusModel,
          as: "jobStatuses",
        },
        {
          model: RecruiterModel,
          as: "recruiter",
          include: [
            {
              model: UserModel,
              as: "user",
            },
            {
              model: CompanyModel,
              as: "company",
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
      ],
    });

    return Job.fromModel(ans);
  }

  async createCoordinators(coordinators: any): Promise<Array<string>> {
    const ans = await this.jobCoordinatorRepo.bulkCreate(coordinators);

    return ans.map((data) => data.id);
  }

  async updateJobs(body: UpdateJobDto[]): Promise<Job[]> {
    const jobs = await this.jobRepo.findAll({ where: { id: body.map((data) => data.id) } });

    const bodyIds = new Set(body.map((data) => data.id));
    const jobIds = new Set(jobs.map((job) => job.id));
    const difference = new Set([...bodyIds].filter((id) => !jobIds.has(id)));

    console.log(difference, bodyIds, jobIds);
    const toUpdate = body.filter((value) => jobIds.has(value.id));
    console.log(toUpdate);

    const pr = toUpdate.map((data) => this.jobRepo.update(data, { where: { id: data.id }, returning: true }));
    const ans = await Promise.all(pr);

    if (difference.size > 0) {
      throw new NotFoundException(`Some jobs were not found. Please check the ids ${Array.from(difference).join(",")}`);
    }

    return ans.map((data) => Job.fromModel(data[1][0]));
  }

  async deleteJobs(ids: string[]): Promise<number> {
    const ans = await this.jobRepo.destroy({
      where: { id: ids },
    });

    return ans;
  }

  async deleteJobCordinators(ids: string[]): Promise<number> {
    const ans = await this.jobCoordinatorRepo.destroy({
      where: { id: ids },
    });

    return ans;
  }
}
