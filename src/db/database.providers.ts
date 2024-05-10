import { Sequelize } from "sequelize-typescript";
import { Logger } from "@nestjs/common";
import {
  UserModel,
  RecruiterModel,
  SeasonModel,
  StudentModel,
  FacultyModel,
  JobModel,
  EventModel,
  CompanyModel,
  PenaltyModel,
  OffCampusOfferModel,
  OnCampusOfferModel,
  ResumeModel,
  ApplicationModel,
  ProgramModel,
  SalaryModel,
  JobCoordinatorModel,
  FacultyApprovalRequestModel,
  TpcMemberModel,
} from "./models";
import { isProductionEnv } from "../utils";
import {
  APPLICATION_DAO,
  COMPANY_DAO,
  EVENT_DAO,
  FACULTY_APPROVAL_REQUEST_DAO,
  FACULTY_DAO,
  INTERVIEW_EXPERIENCE_DAO,
  JOB_COORDINATOR_DAO,
  JOB_DAO,
  JOB_STATUS_DAO,
  OFF_CAMPUS_OFFER_DAO,
  ON_CAMPUS_OFFER_DAO,
  PENALTY_DAO,
  PROGRAM_DAO,
  RECRUITER_DAO,
  REGISTRATIONS_DAO,
  RESUME_DAO,
  SALARY_DAO,
  SEASON_DAO,
  STUDENT_DAO,
  TPC_MEMBER_DAO,
  USER_DAO,
} from "src/constants";
import { env, IEnvironmentVariables } from "src/config";
import { RegistrationModel } from "./models/RegistrationModel";
import { InterviewExperienceModel } from "./models/InterviewExperienceModel";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      const environmentVariables: IEnvironmentVariables = env();
      const { DB_NAME, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } = environmentVariables;

      const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
        host: DB_HOST,
        dialect: "postgres",
        port: DB_PORT,
        logging: isProductionEnv() ? false : (msg) => Logger.debug(msg),
        pool: {
          max: 2,
          min: 1,
          acquire: 30000,
          idle: 10000,
        },
      });
      sequelize.addModels([
        UserModel,
        StudentModel,
        TpcMemberModel,
        RecruiterModel,
        FacultyModel,
        SeasonModel,
        CompanyModel,
        JobModel,
        EventModel,
        ResumeModel,
        ApplicationModel,
        ProgramModel,
        SalaryModel,
        JobCoordinatorModel,
        FacultyApprovalRequestModel,
        PenaltyModel,
        OffCampusOfferModel,
        OnCampusOfferModel,
        RegistrationModel,
        InterviewExperienceModel,
      ]);

      // await sequelize.sync({ force: true });

      return sequelize;
    },
  },
];

export const spacesProviders = [
  {
    provide: USER_DAO,
    useValue: UserModel,
  },
  {
    provide: STUDENT_DAO,
    useValue: StudentModel,
  },
  {
    provide: TPC_MEMBER_DAO,
    useValue: TpcMemberModel,
  },
  {
    provide: FACULTY_DAO,
    useValue: FacultyModel,
  },
  {
    provide: RECRUITER_DAO,
    useValue: RecruiterModel,
  },
  {
    provide: SEASON_DAO,
    useValue: SeasonModel,
  },
  {
    provide: COMPANY_DAO,
    useValue: CompanyModel,
  },
  {
    provide: JOB_DAO,
    useValue: JobModel,
  },
  {
    provide: EVENT_DAO,
    useValue: EventModel,
  },
  {
    provide: RESUME_DAO,
    useValue: ResumeModel,
  },
  {
    provide: APPLICATION_DAO,
    useValue: ApplicationModel,
  },
  {
    provide: FACULTY_APPROVAL_REQUEST_DAO,
    useValue: FacultyApprovalRequestModel,
  },
  {
    provide: SALARY_DAO,
    useValue: SalaryModel,
  },
  {
    provide: JOB_COORDINATOR_DAO,
    useValue: JobCoordinatorModel,
  },
  {
    provide: PROGRAM_DAO,
    useValue: ProgramModel,
  },
  {
    provide: PENALTY_DAO,
    useValue: PenaltyModel,
  },
  {
    provide: ON_CAMPUS_OFFER_DAO,
    useValue: OnCampusOfferModel,
  },
  {
    provide: OFF_CAMPUS_OFFER_DAO,
    useValue: OffCampusOfferModel,
  },
  {
    provide: REGISTRATIONS_DAO,
    useValue: RegistrationModel,
  },
  {
    provide: INTERVIEW_EXPERIENCE_DAO,
    useValue: InterviewExperienceModel,
  },
];
