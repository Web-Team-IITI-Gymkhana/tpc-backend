import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../db/database.module";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [DatabaseModule],
  controllers: [StudentController],
  providers: [StudentService, ConfigService],
})
export class StudentModule {}
