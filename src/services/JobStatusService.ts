import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction } from "sequelize";
import { JOB_STATUS_DAO } from "src/constants";
import { JobStatusModel } from "src/db/models";
import { JobStatus } from "src/entities/JobStatus";

@Injectable()
class JobStatusService {
  private logger = new Logger(JobStatusService.name);

  constructor(@Inject(JOB_STATUS_DAO) private jobStatusRepo: typeof JobStatusModel) {}

  async createJobStatus(jobStatus: JobStatus, t?: Transaction) {
    await this.jobStatusRepo.create(jobStatus, { transaction: t });
  }

  async deleteJobStatus(jobStatusId: string, t?: Transaction) {
    await this.jobStatusRepo.destroy({ where: { id: jobStatusId }, transaction: t });
  }
}

export default JobStatusService;
