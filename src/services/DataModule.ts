import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import {
  ProgramModel,
  JobModel,
  SalaryModel,
  OnCampusOfferModel,
  OffCampusOfferModel,
  CompanyModel,
  RecruiterModel,
  SeasonModel,
  UserModel,
  StudentModel,
  RegistrationModel,
} from "../db/models";
import { DataUploadService } from "./DataService";

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProgramModel,
      JobModel,
      SalaryModel,
      OnCampusOfferModel,
      OffCampusOfferModel,
      CompanyModel,
      RecruiterModel,
      SeasonModel,
      UserModel,
      RegistrationModel,
      StudentModel,
    ]),
  ],
  providers: [DataUploadService],
})
export class DataModule {}
