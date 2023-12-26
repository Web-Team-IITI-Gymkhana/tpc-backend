import { ProgramModel, SalaryModel } from "src/db/models";

export class Program {
  id?: string;
  course: string;
  branch: string;
  year: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    course: string;
    branch: string;
    year: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(model: ProgramModel): Program {
    return new this({
      id: model.id,
      course: model.course,
      year: model.year,
      branch: model.branch,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
