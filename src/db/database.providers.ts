import { Sequelize } from "sequelize-typescript";
import { Logger } from "@nestjs/common";
import {
  UserModel,
  RecruiterModel,
  SeasonModel,
  StudentModel,
  FacultyModel,
  JobModel,
  JobStatusModel,
  EventModel,
  CompanyModel,
} from "./models";
import { isProductionEnv } from "../utils/utils";
import {
  COMPANY_DAO,
  EVENT_DAO,
  FACULTY_DAO,
  JOB_DAO,
  JOB_STATUS_DAO,
  RECRUITER_DAO,
  SEASON_DAO,
  STUDENT_DAO,
  USER_DAO,
} from "src/constants";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      const dbName = process.env.DB_NAME as string;
      const dbUser = process.env.DB_USERNAME as string;
      const dbHost = process.env.DB_HOST;
      const dbDriver = "postgres";
      const dbPassword = process.env.DB_PASSWORD as string;
      const dbPort = Number(process.env.DB_PORT);

      const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: dbDriver,
        port: dbPort,
        logging: isProductionEnv() ? false : (msg) => Logger.debug(msg),
        pool: {
          max: 5,
          min: 1,
          acquire: 30000,
          idle: 10000,
        },
      });
      sequelize.addModels([
        UserModel,
        StudentModel,
        RecruiterModel,
        FacultyModel,
        SeasonModel,
        CompanyModel,
        JobModel,
        JobStatusModel,
        EventModel,
      ]);
      // sequelize.sync({ force: true });
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
    provide: JOB_STATUS_DAO,
    useValue: JobStatusModel,
  },
  {
    provide: EVENT_DAO,
    useValue: EventModel,
  },
];
