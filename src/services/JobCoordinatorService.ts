import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { JOB_COORDINATOR_DAO } from "src/constants";
import { JobCoordinatorModel, TpcMemberModel, UserModel } from "src/db/models";
import { JobCoordinator } from "src/entities/JobCoordinator";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class JobCoordinatorService {
  private logger = new Logger(JobCoordinatorService.name);

  constructor(@Inject(JOB_COORDINATOR_DAO) private jobCoordinatorRepo: typeof JobCoordinatorModel) {}

  async createOrGetJobCoordinator(jobCoordinator: JobCoordinator, t?: Transaction) {
    const [jobCoordinatorModel] = await this.jobCoordinatorRepo.findOrCreate({
      where: omit(jobCoordinator, "tpcMember"),
      defaults: omit(jobCoordinator, "tpcMember"),
      transaction: t,
    });

    return JobCoordinator.fromModel(jobCoordinatorModel);
  }

  async getJobCoordinators(where: WhereOptions<JobCoordinatorModel>, t?: Transaction) {
    const jobCoordinatorModels = await this.jobCoordinatorRepo.findAll({
      where: where,
      transaction: t,
      include: { model: TpcMemberModel, include: [UserModel], required: true },
    });

    return jobCoordinatorModels.map((JobCoordinatorModel) => JobCoordinator.fromModel(JobCoordinatorModel));
  }

  async updateJobCoordinator(jobCoordinatorId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.jobCoordinatorRepo.update(fieldsToUpdate, {
      where: { id: jobCoordinatorId },
      returning: true,
      transaction: t,
    });

    return JobCoordinator.fromModel(updatedModel[0]);
  }

  async deleteJobCoordinator(jobCoordinatorId: string, t?: Transaction) {
    return !!(await this.jobCoordinatorRepo.destroy({ where: { id: jobCoordinatorId }, transaction: t }));
  }
}

export default JobCoordinatorService;
