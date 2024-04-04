import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./db/database.module";
import { TransactionInterceptor } from "./interceptor/TransactionInterceptor";
import { QueryInterceptor } from "./interceptor/QueryInterceptor";
import { StudentModule } from "./student/student.module";
import { RecruiterModule } from "./recruiter/recruiter.module";
import { TpcMemberModule } from "./tpcMember/tpcMember.module";
import { AuthModule } from "./auth/auth.module";
import { ServiceModule } from "./services/service.module";
import { JobModule } from "./job/job.module";
import { PenaltyModule } from "./penalties/penalty.module";
import { FacultyApprovalModule } from "./facultyApproval/facultyApproval.module";
import { SalaryModule } from "./salary/salary.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    { module: DatabaseModule, global: true },
    { module: ServiceModule, global: true },
    AuthModule,
    StudentModule,
    RecruiterModule,
    TpcMemberModule,
    JobModule,
    PenaltyModule,
    FacultyApprovalModule,
    SalaryModule,
  ],
  controllers: [AppController],
  providers: [Logger, TransactionInterceptor, QueryInterceptor, AppService],
})
export class AppModule {}
