import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction } from "sequelize";
import { JOB_STATUS_DAO } from "src/constants";
import { JobStatusModel } from "src/db/models";
import { JobStatus } from "src/entities/JobStatus";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class JobStatusService {
  private logger = new Logger(JobStatusService.name);

  constructor(@Inject(JOB_STATUS_DAO) private jobStatusRepo: typeof JobStatusModel) {}

  async createJobStatus(jobStatus: JobStatus, t?: Transaction) {
    const values = getQueryValues(jobStatus);
    const status =await this.jobStatusRepo.create(values, { transaction: t });
    return status;
  }

  async deleteJobStatus(jobStatusId: string, t?: Transaction) {
    await this.jobStatusRepo.destroy({ where: { id: jobStatusId }, transaction: t });
  }
}

export default JobStatusService;
