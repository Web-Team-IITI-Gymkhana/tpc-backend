import { Module } from "@nestjs/common";
import { EmailService } from "./EmailService";
import { FileService } from "./FileService";
import { GoogleDriveService } from "./GDrive";
import { InsertService } from "./InsertService";
import { UserService } from "./UserService";

@Module({
  providers: [EmailService, FileService, GoogleDriveService, InsertService, UserService],
  exports: [EmailService, FileService, GoogleDriveService, InsertService, UserService],
})
export class ServiceModule {}
