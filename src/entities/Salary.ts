import { SalaryModel } from "src/db/models";
import { Gender, Category } from "../db/enums";

export class Salary {
  id?: string;
  jobId: string;
  salaryPeriod?: string;
  criteria?: object;
  baseSalary: number;
  totalCTC: number;
  takeHomeSalary: number;
  grossSalary: number;
  otherCompensations: number;
  others?: string;

  constructor(input: {
    id?: string;
    jobId: string;
    salaryPeriod?: string;
    criteria?: object;
    baseSalary: number;
    totalCTC: number;
    takeHomeSalary: number;
    grossSalary: number;
    otherCompensations: number;
    others?: string;
  }) {
    Object.assign(this, input);
  }

  static fromModel(model: SalaryModel): Salary {
    return new this({
      id: model.id,
      jobId: model.jobId,
      salaryPeriod: model.salaryPeriod,
      others: model.others,
      criteria: model.criteria,
      baseSalary: model.baseSalary,
      totalCTC: model.totalCTC,
      takeHomeSalary: model.takeHomeSalary,
      grossSalary: model.grossSalary,
      otherCompensations: model.otherCompensations,
    });
  }
}
