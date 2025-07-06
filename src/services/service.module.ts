import { Module } from "@nestjs/common";
import { EmailService } from "./EmailService";
import { FileService } from "./FileService";
import { InsertService } from "./InsertService";
import { UserService } from "./UserService";
import { SignedUrlService } from "./SignedUrlService";

@Module({
  providers: [EmailService, FileService, InsertService, UserService, SignedUrlService],
  exports: [EmailService, FileService, InsertService, UserService, SignedUrlService],
})
export class ServiceModule {}
