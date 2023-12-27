import { ResumeModel } from "src/db/models";

export class Resume {
  id?: string;
  studentId: string;
  metadata?: object;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    studentId: string;
    metadata?: object;
    verified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(resume: ResumeModel): Resume {
    return new this({
      id: resume.id,
      studentId: resume.studentId,
      metadata: resume.metadata,
      verified: resume.verified,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    });
  }
}
