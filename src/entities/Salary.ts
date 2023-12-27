import { SalaryModel } from "src/db/models";

export class Salary {
  id?: string;
  jobId: string;
  salary: number;
  salaryPeriod: number;
  metadata?: object;
  constraints: object;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    jobId: string;
    salary: number;
    salaryPeriod: number;
    metadata?: object;
    constraints: object;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(model: SalaryModel): Salary {
    return new this({
      id: model.id,
      jobId: model.jobId,
      salary: model.salary,
      salaryPeriod: model.salaryPeriod,
      metadata: model.metadata,
      constraints: model.constraints,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
