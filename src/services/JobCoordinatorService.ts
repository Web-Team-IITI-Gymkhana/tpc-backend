import { Inject, Injectable, Logger } from "@nestjs/common";
import { WhereOptions } from "sequelize";
import { JOB_COORDINATOR_DAO } from "src/constants";
import { JobCoordinatorModel } from "src/db/models";
import { JobCoordinator } from "src/entities/JobCoordinator";

@Injectable()
class JobCoordinatorService {
  private logger = new Logger(JobCoordinatorService.name);

  constructor(@Inject(JOB_COORDINATOR_DAO) private jobCoordinatorRepo: typeof JobCoordinatorModel) {}

  async createJobCoordinator(jobCoordinator: JobCoordinator) {
    const JobCoordinatorModel = await this.jobCoordinatorRepo.create(jobCoordinator);
    return JobCoordinator.fromModel(JobCoordinatorModel);
  }

  async getJobCoordinators(where: WhereOptions<JobCoordinatorModel>) {
    const JobCoordinatorModels = await this.jobCoordinatorRepo.findAll({ where: where });
    return JobCoordinatorModels.map((JobCoordinatorModel) => JobCoordinator.fromModel(JobCoordinatorModel));
  }

  async updateJobCoordinator(jobCoordinatorId: string, fieldsToUpdate: object) {
    const [_, updatedModel] = await this.jobCoordinatorRepo.update(fieldsToUpdate, {
      where: { id: jobCoordinatorId },
      returning: true,
    });
    return JobCoordinator.fromModel(updatedModel[0]);
  }

  async deleteJobCoordinator(jobCoordinatorId: string) {
    return !!(await this.jobCoordinatorRepo.destroy({ where: { id: jobCoordinatorId } }));
  }
}

export default JobCoordinatorService;
