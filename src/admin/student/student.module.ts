import { Module } from "@nestjs/common";
import { databaseModule } from "../../db/database.module";
import { studentController } from "./student.controller";
import { studentService } from "./student.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [databaseModule],
  controllers: [studentController],
  providers: [studentService, ConfigService],
})
export class studentModule {}
