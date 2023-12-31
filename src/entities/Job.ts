import { JobModel } from "src/db/models";
import { Company } from "./Company";
import { Recruiter } from "./Recruiter";
import { Season } from "./Season";
import { JobStatus } from "./JobStatus";
import { Category, Gender } from "src/db/enums";

export class Job {
  id?: string;
  seasonId: string;
  season?: Season;
  recruiterId: string;
  recruiter?: Recruiter;
  companyId: string;
  company?: Company;
  role: string;
  eligibility?: {
    programs?: string[];
    gender?: Gender[];
    category?: Category[];
    minCPI?: number;
  };
  active?: boolean;
  metadata?: object;
  currentStatusId?: string;
  currentStatus?: JobStatus;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input: {
    id?: string;
    seasonId: string;
    season?: Season;
    recruiterId: string;
    recruiter?: Recruiter;
    companyId: string;
    company?: Company;
    role: string;
    eligibility?: {
      programs?: string[];
      gender?: Gender[];
      category?: Category[];
      minCPI?: number;
    };
    active?: boolean;
    metadata?: object;
    currentStatusId?: string;
    currentStatus?: JobStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, input);
  }

  static fromModel(job: JobModel): Job {
    return new this({
      id: job.id,
      seasonId: job.seasonId,
      season: job.season && Season.fromModel(job.season),
      companyId: job.companyId,
      company: job.company && Company.fromModel(job.company),
      role: job.role,
      recruiterId: job.recruiterId,
      active: job.active,
      eligibility: job.eligibility,
      currentStatusId: job.currentStatusId,
      currentStatus: job.currentStatus && JobStatus.fromModel(job.currentStatus),
      metadata: job.metadata,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  }
}
