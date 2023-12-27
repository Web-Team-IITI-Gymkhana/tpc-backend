import { Body, Controller, Inject, Post, UseInterceptors, ClassSerializerInterceptor } from "@nestjs/common";
import { COMPANY_SERVICE, JOB_SERVICE, JOB_STATUS_SERVICE, SEASON_SERVICE } from "src/constants";
import { AddCompanyDto, AddJobDto, AddSeasonDto } from "./admin.dto";
import SeasonService from "src/services/SeasonService";
import { Season } from "src/entities/Season";
import CompanyService from "src/services/CompanyService";
import { Company } from "src/entities/Company";
import JobService from "src/services/JobService";
import JobStatusService from "src/services/JobStatusService";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import { TransactionParam } from "src/decorators/TransactionParam";
import { Transaction } from "sequelize";
import { Job } from "src/entities/Job";
import { JobStatus } from "src/entities/JobStatus";
import { JobStatusType } from "src/db/enums";

@Controller("/admin")
export class AdminController {
  constructor(
    @Inject(SEASON_SERVICE) private seasonService: SeasonService,
    @Inject(COMPANY_SERVICE) private companyService: CompanyService,
    @Inject(JOB_SERVICE) private jobService: JobService
  ) {}

  @Post("/season")
  @UseInterceptors(ClassSerializerInterceptor)
  async addSeason(@Body() body: AddSeasonDto) {
    const season = await this.seasonService.createSeason(new Season({ type: body.type, year: body.year }));
    return { season: season };
  }

  @Post("/company")
  @UseInterceptors(ClassSerializerInterceptor)
  async addCompany(@Body() body: AddCompanyDto) {
    const company = await this.companyService.createCompany(new Company({ name: body.name }));
    return { company: company };
  }

  @Post("/job")
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async addJob(@Body() body: AddJobDto, @TransactionParam() transaction: Transaction) {
    const job = await this.jobService.createJob(
      new Job({
        seasonId: body.seasonId,
        companyId: body.companyId,
        recruiterId: body.recruiterId,
        role: body.role,
        metadata: body.metadata,
      }),
      transaction
    );

    const updatedJob = await this.jobService.upsertJobStatusAndUpdateCurrent(
      new JobStatus({ jobId: job.id, status: JobStatusType.INITIALIZED }),
      transaction
    );
    return { job: updatedJob };
  }
}
