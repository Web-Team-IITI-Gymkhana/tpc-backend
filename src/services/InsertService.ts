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
  REGISTRATIONS,
  INTERVIEW_EXPERIENCES,
} from "src/test/data";
import {
  DUMMY_COMPANY,
  DUMMY_RECRUITER,
  DUMMY_USER,
  IE_FOLDER,
  JD_FOLDER,
  LOGIN_ADMIN,
  RESUME_FOLDER,
} from "src/constants";
import { FileService } from "./FileService";
import path from "path";

@Injectable()
export class InsertService {
  resumeFolder = RESUME_FOLDER;
  ieFolder = IE_FOLDER;
  jdFolder = JD_FOLDER;
  private logger = new Logger(InsertService.name);

  constructor(
    @Inject("SEQUELIZE") private readonly sequelizeInstance: Sequelize,
    private fileService: FileService
  ) {}

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
    const registerations = await this.sequelizeInstance.models.RegistrationModel.bulkCreate(REGISTRATIONS);
    const ies = await this.sequelizeInstance.models.InterviewExperienceModel.bulkCreate(INTERVIEW_EXPERIENCES);
    await this.sequelizeInstance.models.CompanyModel.create(DUMMY_COMPANY);
    await this.sequelizeInstance.models.UserModel.create(DUMMY_USER);
    await this.sequelizeInstance.models.RecruiterModel.create(DUMMY_RECRUITER);
    await this.sequelizeInstance.models.UserModel.create(LOGIN_ADMIN);

    const file = await this.fileService.getFileasBuffer("src/test/resume.pdf");

    for (const resume of RESUMES) {
      await this.fileService.uploadFile(path.join(this.resumeFolder, resume.filepath), { buffer: file });
    }

    for (const ie of INTERVIEW_EXPERIENCES) {
      await this.fileService.uploadFile(path.join(this.ieFolder, ie.filename), { buffer: file });
    }

    for (const job of JOBS) {
      if (!job.attachment) continue;
      await this.fileService.uploadFile(path.join(this.jdFolder, job.attachment), { buffer: file });
    }

    this.logger.log("Successfully Inserted");

    return true;
  }
}
