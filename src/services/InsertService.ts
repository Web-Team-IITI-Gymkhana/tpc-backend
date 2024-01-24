import { Inject, Injectable } from "@nestjs/common";
import { COMPANY_DAO, FACULTY_DAO, RECRUITER_DAO, SEASON_DAO, STUDENT_DAO, TPC_MEMBER_DAO, USER_DAO } from "src/constants";
import { CompanyModel, FacultyModel, RecruiterModel, SeasonModel, StudentModel, TpcMemberModel, UserModel } from "src/db/models";

import { SEASON1, SEASON2, USER1 } from "../test/data"; // Update the path

@Injectable()
export class InsertService {
    constructor(
        @Inject(SEASON_DAO) private seasonRepo: typeof SeasonModel,
        @Inject(COMPANY_DAO)  private companyRepo: typeof CompanyModel,
        @Inject(USER_DAO) private userRepo: typeof UserModel,
        @Inject(STUDENT_DAO) private studentRepo: typeof StudentModel,
        @Inject(RECRUITER_DAO)  private recruiterRepo: typeof RecruiterModel,
        @Inject(FACULTY_DAO) private facultyRepo: typeof FacultyModel,
        @Inject(TPC_MEMBER_DAO) private tpcMemberRepo: typeof TpcMemberModel
    ) {}

    async onModuleInit() {
        await this.insert();
    }

    async insert() {
        // // Insert seasons
        // await this.seasonRepo.create(SEASON1);
        // await this.seasonRepo.create(SEASON2);

        // // Insert users
        // await this.userRepo.create(USER1);
    }
}
