import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./db/database.module";
import {
  AUTH_SERVICE,
  COMPANY_SERVICE,
  EVENT_SERVICE,
  FACULTY_SERVICE,
  FACULTY_APPROVAL_REQUEST_SERVICE,
  JOB_COORDINATOR_SERVICE,
  JOB_SERVICE,
  JOB_STATUS_SERVICE,
  OFF_CAMPUS_OFFER_SERVICE,
  ON_CAMPUS_OFFER_SERVICE,
  PENALTY_SERVICE,
  PROGRAM_SERVICE,
  RECRUITER_SERVICE,
  SALARY_SERVICE,
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
import FacultyApprovalRequestService from "./services/FacultyApprovalRequest";
import EventService from "./services/EventService";
import StudentService from "./services/StudentService";
import { StudentController } from "./controllers/student";
import TpcMemberService from "./services/TpcMemberService";
import { TpcMemberController } from "./controllers/tpcMember";
import PenaltyService from "./services/PenaltyService";
import JobCoordinatorService from "./services/JobCoordinatorService";
import { FacultyController } from "./controllers/faculty";
import FacultyService from "./services/FacultyService";
import { JobCoordinatorController } from "./controllers/jobCoordinator";
import SalaryService from "./services/SalaryService";
import { SalaryController } from "./controllers/salary";
import { OffCampusOfferController } from "./controllers/offCampusOffer";
import OffCampusOfferService from "./services/OffCampusOfferService";
import { OnCampusOfferController } from "./controllers/onCampusOffer";
import OnCampusOfferService from "./services/OnCampusOfferService";
import { QueryInterceptor } from "./interceptor/QueryInterceptor";

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
    FacultyController,
    JobCoordinatorController,
    OffCampusOfferController,
    OnCampusOfferController,
    SalaryController,
  ],
  providers: [
    Logger,
    JwtStrategy,
    TransactionInterceptor,
    QueryInterceptor,
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
    {
      provide: FACULTY_SERVICE,
      useClass: FacultyService,
    },
    {
      provide: FACULTY_APPROVAL_REQUEST_SERVICE,
      useClass: FacultyApprovalRequestService,
    },
    {
      provide: SALARY_SERVICE,
      useClass: SalaryService,
    },
    {
      provide: OFF_CAMPUS_OFFER_SERVICE,
      useClass: OffCampusOfferService,
    },
    {
      provide: ON_CAMPUS_OFFER_SERVICE,
      useClass: OnCampusOfferService,
    },
  ],
})
export class AppModule {}
