import { RecruiterModel } from "src/db/models";
import { User } from "./User";
import { Company } from "./Company";

export class Recruiter {
  id?: string;
  userId: string;
  user?: User;
  companyId: string;
  company?: Company;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    userId: string;
    user?: User;
    companyId: string;
    company?: Company;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(recruiter: RecruiterModel): Recruiter {
    return new this({
      id: recruiter.id,
      userId: recruiter.userId,
      user: recruiter.user && User.fromModel(recruiter.user),
      companyId: recruiter.companyId,
      company: recruiter.company && Company.fromModel(recruiter.company),
      createdAt: recruiter.createdAt,
      updatedAt: recruiter.updatedAt,
    });
  }
}
