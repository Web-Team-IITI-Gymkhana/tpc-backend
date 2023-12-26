import { OffCampusOfferModel, SalaryModel } from "src/db/models";

export class OffCampusOffer {
  id?: string;
  companyId: string;
  seasonId: string;
  studentId: string;
  salary: number;
  salaryPeriod: number;
  metadata?: object;
  offerType: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    companyId: string;
    seasonId: string;
    studentId: string;
    salary: number;
    salaryPeriod: number;
    metadata?: object;
    offerType: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(model: OffCampusOfferModel): OffCampusOffer {
    return new this({
      id: model.id,
      studentId: model.studentId,
      companyId: model.companyId,
      seasonId: model.seasonId,
      offerType: model.offerType,
      salary: model.salary,
      salaryPeriod: model.salaryPeriod,
      status: model.status,
      metadata: model.metadata,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
