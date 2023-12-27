import { JobStatusModel } from "src/db/models";
import { JobStatusType } from "src/db/enums";

export class JobStatus {
  id?: string;
  jobId: string;
  status: JobStatusType;
  transition?: string;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    jobId: string;
    status: JobStatusType;
    transition?: string;
    message?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(jobStatus: JobStatusModel): JobStatus {
    return new this({
      id: jobStatus.id,
      jobId: jobStatus.jobId,
      status: jobStatus.status as JobStatusType,
      transition: jobStatus.transition,
      message: jobStatus.message,
      createdAt: jobStatus.createdAt,
      updatedAt: jobStatus.updatedAt,
    });
  }
}
