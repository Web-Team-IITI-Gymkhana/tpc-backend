import { PenaltyModel } from "src/db/models";

export class Penalty {
  id?: string;
  studentId: string;
  penalty: number;
  reason: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    studentId: string;
    penalty: number;
    reason: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(model: PenaltyModel): Penalty {
    return new this({
      id: model.id,
      studentId: model.studentId,
      penalty: model.penalty,
      reason: model.reason,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
