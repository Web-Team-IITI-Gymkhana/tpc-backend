import { Inject, Injectable, Logger } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import {
  SEASONS,
  USERS,
  COMPANIES,
  FACULTIES,
  PROGRAMS,
  TPC_MEMBERS,
  STUDENTS,
  RECRUITERS,
  RESUMES,
  JOBS,
  SALARIES,
  PENALTIES,
  ON_CAMPUS_OFFERS,
  OFF_CAMPUS_OFFERS,
  JOB_COORDINATORS,
  FACULTY_APPROVAL_REQUESTS,
  EVENTS,
  APPLICATIONS,
} from "src/test/data";
import { DUMMY_COMPANY, DUMMY_RECRUITER, DUMMY_USER, LOGIN_USER } from "src/constants";

@Injectable()
export class InsertService {
  private logger = new Logger(InsertService.name);

  constructor(@Inject("SEQUELIZE") private readonly sequelizeInstance: Sequelize) {}

  async onModuleInit() {
    // await this.insert();
  }

  async insert() {
    const seasons = await this.sequelizeInstance.models.SeasonModel.bulkCreate(SEASONS);
    const users = await this.sequelizeInstance.models.UserModel.bulkCreate(USERS);
    const programs = await this.sequelizeInstance.models.ProgramModel.bulkCreate(PROGRAMS);
    const companies = await this.sequelizeInstance.models.CompanyModel.bulkCreate(COMPANIES);
    const faculties = await this.sequelizeInstance.models.FacultyModel.bulkCreate(FACULTIES);
    const tpcMembers = await this.sequelizeInstance.models.TpcMemberModel.bulkCreate(TPC_MEMBERS);
    const students = await this.sequelizeInstance.models.StudentModel.bulkCreate(STUDENTS);
    const penalties = await this.sequelizeInstance.models.PenaltyModel.bulkCreate(PENALTIES);
    const recruiters = await this.sequelizeInstance.models.RecruiterModel.bulkCreate(RECRUITERS);
    const resumes = await this.sequelizeInstance.models.ResumeModel.bulkCreate(RESUMES);
    const jobs = await this.sequelizeInstance.models.JobModel.bulkCreate(JOBS);
    const salaries = await this.sequelizeInstance.models.SalaryModel.bulkCreate(SALARIES);
    const onCampusOffers = await this.sequelizeInstance.models.OnCampusOfferModel.bulkCreate(ON_CAMPUS_OFFERS);
    const offCampusOffers = await this.sequelizeInstance.models.OffCampusOfferModel.bulkCreate(OFF_CAMPUS_OFFERS);
    const jobCoordinators = await this.sequelizeInstance.models.JobCoordinatorModel.bulkCreate(JOB_COORDINATORS);
    const approvals =
      await this.sequelizeInstance.models.FacultyApprovalRequestModel.bulkCreate(FACULTY_APPROVAL_REQUESTS);
    const events = await this.sequelizeInstance.models.EventModel.bulkCreate(EVENTS);
    const applications = await this.sequelizeInstance.models.ApplicationModel.bulkCreate(APPLICATIONS);
    await this.sequelizeInstance.models.CompanyModel.create(DUMMY_COMPANY);
    await this.sequelizeInstance.models.UserModel.create(DUMMY_USER);
    await this.sequelizeInstance.models.RecruiterModel.create(DUMMY_RECRUITER);
    await this.sequelizeInstance.models.UserModel.create(LOGIN_USER);

    this.logger.log("Successfully Inserted");

    return true;
  }
}
