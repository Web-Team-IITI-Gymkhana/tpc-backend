import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./db/database.module";
import {
  COMPANY_SERVICE,
  JOB_SERVICE,
  JOB_STATUS_SERVICE,
  RECRUITER_SERVICE,
  SEASON_SERVICE,
  USER_SERVICE,
} from "./constants";
import UserService from "./services/UserService";
import { AuthController } from "./auth/auth.controller";
import SeasonService from "./services/SeasonService";
import { AdminController } from "./admin/admin.controller";
import CompanyService from "./services/CompanyService";
import JobService from "./services/JobService";
import JobStatusService from "./services/JobStatusService";
import { TransactionInterceptor } from "./interceptor/TransactionInterceptor";
import RecruiterService from "./services/RecruiterService";
import { RecruiterController } from "./recruiter/recruiter.controller";

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  controllers: [AppController, AuthController, AdminController, RecruiterController],
  providers: [
    Logger,
    TransactionInterceptor,
    AppService,
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
  ],
})
export class AppModule {}
