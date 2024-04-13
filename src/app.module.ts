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
import { StudentViewModule } from "./student-view/students/student.module";
import { StudentViewJobModule } from "./student-view/job/job.module";
import { InterviewExperienceModule } from "./student-view/interview-experiences/ie.module";
import { StudentOfferModule } from "./student-view/offers/offer.module";
import { UserModule } from "./user/user.module";
import { SeasonModule } from "./season/season.module";
import { RegistrationsModule } from "./registrations/registrations.module";
import { FacultyModule } from "./faculty/faculty.module";
import { ProgramModule } from "./program/program.module";
import { ResumeModule } from "./resume/resume.module";
import { EventModule } from "./event/event.module";
import { CompanyModule } from "./company/company.module";

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
    StudentViewModule,
    StudentViewJobModule,
    InterviewExperienceModule,
    StudentOfferModule,
    UserModule,
    SeasonModule,
    RegistrationsModule,
    FacultyModule,
    ProgramModule,
    ResumeModule,
    EventModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [Logger, TransactionInterceptor, QueryInterceptor, AppService],
})
export class AppModule {}
