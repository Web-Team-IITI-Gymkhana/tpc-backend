import { Inject, Injectable } from "@nestjs/common";
import {
  COMPANY_DAO,
  COURSE_BRANCH_MAP,
  FACULTY_DAO,
  JOB_DAO,
  PROGRAM_DAO,
  RECRUITER_DAO,
  SEASON_DAO,
  STUDENT_DAO,
  TPC_MEMBER_DAO,
  USER_DAO,
  YEARS,
} from "src/constants";
import {
  CompanyModel,
  FacultyModel,
  JobModel,
  ProgramModel,
  RecruiterModel,
  SeasonModel,
  StudentModel,
  TpcMemberModel,
  UserModel,
} from "src/db/models";

import { SEASONS, USERS, JOBS, RECRUITERS, COMPANIES, TpcMembers } from "../test/data"; // Update the path
import { omit } from "lodash";
import { Program } from "src/entities/Program";

@Injectable()
export class InsertService {
  constructor(
    @Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel,
    @Inject(COMPANY_DAO) private companyRepo: typeof CompanyModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel,
    @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
    @Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel,
    @Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel,
    @Inject(TPC_MEMBER_DAO) private tpcMemberRepo: typeof TpcMemberModel,
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(PROGRAM_DAO) private programRepo: typeof ProgramModel
  ) {}

  async onModuleInit() {
    // await this.insert();
  }

  async insert() {
    await this.seasonRepo.bulkCreate(SEASONS, { updateOnDuplicate: ["id"] });
    await this.companyRepo.bulkCreate(
      COMPANIES.map((Company) => omit(Company, "jobs")),
      { updateOnDuplicate: ["id"] }
    );
    await this.userRepo.bulkCreate(USERS, { updateOnDuplicate: ["id"] });
    await this.recruiterRepo.bulkCreate(
      RECRUITERS.map((recruiter) => omit(recruiter, "user", "company")),
      { updateOnDuplicate: ["id"] }
    );
    await this.jobRepo.bulkCreate(JOBS, { updateOnDuplicate: ["id"] });
    await this.tpcMemberRepo.bulkCreate(
      TpcMembers.map((tpcMember) => omit(tpcMember, "user")),
      { updateOnDuplicate: ["id"] }
    );
    const programs = this.getDefaultPrograms();
    await this.programRepo.bulkCreate(programs, { updateOnDuplicate: ["id"] });
  }

  private getDefaultPrograms() {
    const programs: Program[] = [];
    for (const year of YEARS) {
      for (const course of Object.keys(COURSE_BRANCH_MAP)) {
        const branches = COURSE_BRANCH_MAP[course];
        for (const branch of branches) {
          programs.push(new Program({ course: course, branch: branch, year: year }));
        }
      }
    }

    return programs;
  }
}
