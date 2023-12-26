import { OnCampusOfferModel } from "src/db/models";

export class OnCampusOffer {
  id?: string;
  salaryId: string;
  studentId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    salaryId: string;
    studentId: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(model: OnCampusOfferModel): OnCampusOffer {
    return new this({
      id: model.id,
      salaryId: model.salaryId,
      studentId: model.studentId,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
