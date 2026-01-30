// src/data/DataCliModule.ts
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DataModule } from "./DataModule";
import { PPOUploadService } from "./PPOUploadService";
import {
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
  ExternalOpportunitiesModel,
} from "../db/models";
import { FeedbackModel } from "../db/models/FeedbackModel";
import { InterviewExperienceModel } from "../db/models/InterviewExperienceModel";
import { env, IEnvironmentVariables } from "../config";

const environmentVariables: IEnvironmentVariables = env();
const { DB_NAME, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } = environmentVariables;

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      models: [
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
        ExternalOpportunitiesModel,
        FeedbackModel,
        InterviewExperienceModel,
      ],
      autoLoadModels: true,
      synchronize: false,
    }),
    DataModule,
    SequelizeModule.forFeature([
      ProgramModel,
      JobModel,
      SalaryModel,
      OnCampusOfferModel,
      CompanyModel,
      RecruiterModel,
      SeasonModel,
      UserModel,
      StudentModel,
    ]),
  ],
  providers: [PPOUploadService],
  exports: [PPOUploadService],
})
export class DataCliModule {}
