import { JobCoordinatorModel } from "src/db/models";
import { TpcMember } from "./TpcMember";

export class JobCoordinator {
  id?: string;
  jobId: string;
  tpcMemberId: string;
  role: string;
  tpcMember?: TpcMember;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    jobId: string;
    tpcMemberId: string;
    role: string;
    tpcMember?: TpcMember;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(model: JobCoordinatorModel): JobCoordinator {
    return new this({
      id: model.id,
      tpcMemberId: model.tpcMemberId,
      role: model.role,
      jobId: model.jobId,
      tpcMember: model.tpcMember && TpcMember.fromModel(model.tpcMember),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
