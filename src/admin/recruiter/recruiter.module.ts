import { Module } from "@nestjs/common";
import { recruiterController } from "./recruiter.controller";
import { recruiterService } from "./recruiter.service";
import { databaseModule } from "../../db/database.module";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [databaseModule],
  controllers: [recruiterController],
  providers: [recruiterService, ConfigService],
})
export class recruiterModule {}
