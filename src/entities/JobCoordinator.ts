import { JobCoordinatorModel } from "src/db/models";

export class JobCoordinator {
  id?: string;
  jobId: string;
  userId: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: { id?: string; jobId: string; userId: string; role: string; createdAt?: Date; updatedAt?: Date }) {
    Object.assign(this, input);
  }

  static fromModel(model: JobCoordinatorModel): JobCoordinator {
    return new this({
      id: model.id,
      userId: model.userId,
      role: model.role,
      jobId: model.jobId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
