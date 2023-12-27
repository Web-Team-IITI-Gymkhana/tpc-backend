import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./db/database.module";
import {
  AUTH_SERVICE,
  COMPANY_SERVICE,
  EVENT_SERVICE,
  JOB_SERVICE,
  JOB_STATUS_SERVICE,
  PROGRAM_SERVICE,
  RECRUITER_SERVICE,
  SEASON_SERVICE,
  STUDENT_SERVICE,
  USER_SERVICE,
} from "./constants";
import UserService from "./services/UserService";
import { AuthController } from "./auth/auth.controller";
import SeasonService from "./services/SeasonService";
import CompanyService from "./services/CompanyService";
import JobService from "./services/JobService";
import JobStatusService from "./services/JobStatusService";
import { TransactionInterceptor } from "./interceptor/TransactionInterceptor";
import RecruiterService from "./services/RecruiterService";
import { RecruiterController } from "./recruiter/recruiter.controller";
import { JwtStrategy } from "./auth/JwtStrategy";
import AuthService from "./services/AuthService";
import ProgramService from "./services/ProgramService";
import { AdminController } from "./admin/controllers/admin";
import { AdminCompanyController } from "./admin/controllers/company";
import { AdminSeasonController } from "./admin/controllers/season";
import { AdminJobController } from "./admin/controllers/job";
import EventService from "./services/EventService";
import StudentService from "./services/StudentService";
import { AdminStudentController } from "./admin/controllers/student";

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  controllers: [
    AppController,
    AuthController,
    AdminController,
    AdminSeasonController,
    AdminCompanyController,
    AdminJobController,
    AdminStudentController,
    RecruiterController,
  ],
  providers: [
    Logger,
    JwtStrategy,
    TransactionInterceptor,
    AppService,
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: PROGRAM_SERVICE,
      useClass: ProgramService,
    },
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    {
      provide: RECRUITER_SERVICE,
      useClass: RecruiterService,
    },
    {
      provide: SEASON_SERVICE,
      useClass: SeasonService,
    },
    {
      provide: COMPANY_SERVICE,
      useClass: CompanyService,
    },
    {
      provide: JOB_SERVICE,
      useClass: JobService,
    },
    {
      provide: JOB_STATUS_SERVICE,
      useClass: JobStatusService,
    },
    {
      provide: EVENT_SERVICE,
      useClass: EventService,
    },
    {
      provide: STUDENT_SERVICE,
      useClass: StudentService,
    },
  ],
})
export class AppModule {}
