import { Module } from "@nestjs/common";
import { EmailService } from "./EmailService";
import { FileService } from "./FileService";
import { InsertService } from "./InsertService";
import { UserService } from "./UserService";

@Module({
  providers: [EmailService, FileService, InsertService, UserService],
  exports: [EmailService, FileService, InsertService, UserService],
})
export class ServiceModule {}
