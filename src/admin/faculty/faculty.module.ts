import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/db/database.module";
import { ConfigService } from "@nestjs/config";
import { facultyController } from "./faculty.controller";
import { facultyService } from "./faculty.service";

@Module({
  imports: [DatabaseModule],
  controllers: [facultyController],
  providers: [ConfigService, facultyService],
})
export class facultyModule {}
