import { Module } from "@nestjs/common";
import { databaseModule } from "src/db/database.module";
import { ConfigService } from "@nestjs/config";
import { facultyController } from "./faculty.controller";
import { facultyService } from "./faculty.service";

@Module({
  imports: [databaseModule],
  controllers: [facultyController],
  providers: [ConfigService, facultyService],
})
export class facultyModule {}
