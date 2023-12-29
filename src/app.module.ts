import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./db/database.module";
import {
  AUTH_SERVICE,
  COMPANY_SERVICE,
  EVENT_SERVICE,
  JOB_COORDINATOR_DAO,
  JOB_COORDINATOR_SERVICE,
  JOB_SERVICE,
  JOB_STATUS_SERVICE,
  PENALTY_SERVICE,
  PROGRAM_SERVICE,
  RECRUITER_SERVICE,
  SEASON_SERVICE,
  STUDENT_SERVICE,
  TPC_MEMBER_SERVICE,
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
import { RecruiterController } from "./controllers/recruiter";
import { JwtStrategy } from "./auth/JwtStrategy";
import AuthService from "./services/AuthService";
import ProgramService from "./services/ProgramService";
import { AdminController } from "./controllers/admin";
import { CompanyController } from "./controllers/company";
import { SeasonController } from "./controllers/season";
import { JobController } from "./controllers/job";
import EventService from "./services/EventService";
import StudentService from "./services/StudentService";
import { StudentController } from "./controllers/student";
import TpcMemberService from "./services/TpcMemberService";
import { TpcMemberController } from "./controllers/tpcMember";
import PenaltyService from "./services/PenaltyService";
import { PenaltyController } from "./controllers/penalty";
import JobCoordinatorService from "./services/JobCoordinatorService";
@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  controllers: [
    AppController,
    AuthController,
    AdminController,
    SeasonController,
    CompanyController,
    JobController,
    StudentController,
    TpcMemberController,
    RecruiterController,
    PenaltyController,
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
      provide: TPC_MEMBER_SERVICE,
      useClass: TpcMemberService,
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
    {
      provide: PENALTY_SERVICE,
      useClass: PenaltyService,
    },
    {
      provide: JOB_COORDINATOR_SERVICE,
      useClass: JobCoordinatorService,
    },
  ],
})
export class AppModule {}
