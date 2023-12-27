import { CompanyModel } from "src/db/models";

export class Company {
  id?: string;
  name: string;
  metadata?: object;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: { id?: string; name: string; metadata?: object; createdAt?: Date; updatedAt?: Date }) {
    Object.assign(this, input);
  }

  static fromModel(company: CompanyModel): Company {
    return new this({
      id: company.id,
      name: company.name,
      metadata: company.metadata,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }
}
