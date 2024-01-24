import { CompanyModel, JobModel } from "src/db/models";
import { CompanyCategory } from "../db/enums";
import IndustryDomain from "src/db/enums/industryDomains.enum";
import { AddressDto } from "src/dtos/jaf";
import { Job } from "./Job";

export class Company {
  id?: string;
  name: string;
  website?: string;
  domains?: IndustryDomain[];
  category: CompanyCategory;
  address: AddressDto;
  size?: number;
  yearOfEstablishment: number;
  annualTurnover?: string;
  socialMediaLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
  jobs?: Job[];

  constructor(input: {
    id?: string;
    name: string;
    website?: string;
    domains?: IndustryDomain[];
    category: CompanyCategory;
    address: AddressDto;
    size?: number;
    yearOfEstablishment: number;
    annualTurnover?: string;
    socialMediaLink?: string;
    createdAt?: Date;
    updatedAt?: Date;
    jobs?: Job[];
  }) {
    Object.assign(this, input);
  }

  static fromModel(company: CompanyModel): Company {
    return new this({
      id: company.id,
      name: company.name,
      website: company.website,
      domains: company.domains,
      category: company.category,
      address: company.address as AddressDto,
      size: company.size,
      yearOfEstablishment: company.yearOfEstablishment,
      annualTurnover: company.annualTurnover,
      socialMediaLink: company.socialMediaLink,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      jobs: company.jobs && company.jobs.map((job) => Job.fromModel(job)),
    });
  }
}
