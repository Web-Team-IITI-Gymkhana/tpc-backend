import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StudentModule } from "./admin/student/student.module";
import { RecruiterModule } from "./recruiter/recruiter.module";
import { DatabaseModule } from "./db/database.module";

@Module({
  imports: [StudentModule, RecruiterModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
