import { FacultyApprovalRequestModel } from "src/db/models";

export class FacultyApprovalRequest {
  id?: string;
  facultyId: string;
  jobId: string;
  remarks?: string;
  approved?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    facultyId: string;
    jobId: string;
    remarks?: string;
    approved?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(model: FacultyApprovalRequestModel): FacultyApprovalRequest {
    return new this({
      id: model.id,
      facultyId: model.facultyId,
      remarks: model.remarks,
      jobId: model.jobId,
      approved: model.approved,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
