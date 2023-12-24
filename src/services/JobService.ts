import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction } from "sequelize";
import { JOB_DAO, JOB_STATUS_DAO } from "src/constants";
import { JobModel, JobStatusModel } from "src/db/models";
import { Job } from "src/entities/Job";
import { JobStatus } from "src/entities/JobStatus";

@Injectable()
class JobService {
  private logger = new Logger(JobService.name);

  constructor(
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(JOB_STATUS_DAO) private jobStatusRepo: typeof JobStatusModel
  ) {}

  async createJob(job: Job, t?: Transaction) {
    const jobModel = await this.jobRepo.create(omit(job, "company", "season", "recruiter", "currentStatus"), {
      transaction: t,
    });
    return Job.fromModel(jobModel);
  }

  async updateJob(jobId: string, fieldsToUpdate: object, transaction?: Transaction): Promise<Job> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, updatedJob] = await this.jobRepo.update(fieldsToUpdate, {
      where: { id: jobId },
      returning: true,
      transaction,
    });
    return Job.fromModel(updatedJob[0]);
  }

  async upsertJobStatusAndUpdateCurrent(jobStatus: JobStatus, transaction?: Transaction) {
    const [instance] = await this.jobStatusRepo.upsert(jobStatus, {
      transaction: transaction,
    });
    const job = await this.updateJob(instance.jobId, { currentStatusId: instance.id }, transaction);
    return job;
  }

  async deleteJob(jobId: string, t?: Transaction) {
    await this.jobRepo.destroy({ where: { id: jobId }, transaction: t });
  }
}

export default JobService;
