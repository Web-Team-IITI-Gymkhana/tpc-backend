import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth } from "@nestjs/swagger";
import { randomUUID } from "crypto";
import sequelize from "sequelize";
import { Transaction } from "sequelize";
import {
  FILE_SERVICE,
  JAF_SERVICE,
  JOB_STATUS_SERVICE,
  PROGRAM_SERVICE,
  SALARY_SERVICE,
  SEASON_SERVICE,
} from "src/constants";
import { Category, Gender, JobStatusType } from "src/db/enums";
import { Countries } from "src/db/enums/Country.enum";
import IndustryDomain from "src/db/enums/industryDomains.enum";
import { InterviewTypes } from "src/db/enums/interviewTypes.enum";
import { TestTypes } from "src/db/enums/testTypes.enum";
import { TransactionParam } from "src/decorators/TransactionParam";
import { CreateJafDto, SalaryDetailsDto, TestDetailsDto } from "src/dtos/jaf";
import { QueryInterceptor } from "src/interceptor/QueryInterceptor";
import { TransactionInterceptor } from "src/interceptor/TransactionInterceptor";
import EventService from "src/services/EventService";
import { FileService } from "src/services/FileService";
import JafService from "src/services/JafService";
import JobStatusService from "src/services/JobStatusService";
import ProgramService from "src/services/ProgramService";
import SalaryService from "src/services/SalaryService";
import SeasonService from "src/services/SeasonService";
import { v4 as uuidv4 } from "uuid";

@Controller("jaf")
@ApiBearerAuth("jwt")
// @UseGuards(AuthGuard("jwt"))
export class JafController {
  constructor(
    @Inject(SEASON_SERVICE) private seasonService: SeasonService,
    @Inject(JAF_SERVICE) private jobService: JafService,
    @Inject(SALARY_SERVICE) private salaryService: SalaryService,
    @Inject(PROGRAM_SERVICE) private programService: ProgramService,
    @Inject(JOB_STATUS_SERVICE) private jobStatusService: JobStatusService,
    @Inject(FILE_SERVICE) private fileService: FileService
  ) {}

  async createSalaries(salaries: SalaryDetailsDto[], jobId: string, t: Transaction) {
    console.log(salaries);
    const promises = [];
    for (const salary of salaries) {
      promises.push(
        this.salaryService.createSalary(
          {
            jobId: jobId,
            salaryPeriod: salary.salaryPeriod,
            criteria: salary.criteria,
            baseSalary: salary.baseSalary,
            totalCTC: salary.totalCTC,
            takeHomeSalary: salary.takeHomeSalary,
            grossSalary: salary.grossSalary,
            otherCompensations: salary.otherCompensations,
            others: salary.others,
          },
          t
        )
      );
    }
    const newSalaries = await Promise.all(promises);

    return newSalaries;
  }

  @Get()
  async getJaf() {
    const ans = {};
    const season = this.seasonService.getSeasons();
    const programs = this.programService.getPrograms();
    ans["genders"] = Object.values(Gender);
    ans["categories"] = Object.values(Category);
    ans["testTypes"] = Object.values(TestTypes);
    ans["domains"] = Object.values(IndustryDomain);
    ans["interviewTypes"] = Object.values(InterviewTypes);
    ans["countries"] = Object.values(Countries);
    [ans["seasons"], ans["programs"]] = await Promise.all([season, programs]);
    return ans;
  }

  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(FileInterceptor("attachment"))
  @Post()
  async createJaf(@Body() body: CreateJafDto, @TransactionParam() t: Transaction, @UploadedFile() file: any) {
    let attachment = undefined;
    if (file) {
      attachment = this.fileService.uploadFile(file);
    }
    const job = await this.jobService.createJob(
      {
        seasonId: body.seasonId,
        role: body.job.role,
        description: body.job.description,
        skills: body.job.skills,
        attachment: attachment,
        location: body.job.location,
        noOfVacancies: body.job.noOfVacancies,
        offerLetterReleaseDate: body.job.offerLetterReleaseDate,
        joiningDate: body.job.joiningDate,
        duration: body.job.duration,
        selectionProcedure: body.job.selectionProcedure,
        others: body.job.others,
        companyDetailsFilled: body.company,
        recruiterDetailsFilled: body.recruiter,
        active: false,
      },
      t
    );

    const salaries = await this.createSalaries(body.job.salaries, job.id, t);
    const status = await this.jobStatusService.createJobStatus({ jobId: job.id, status: JobStatusType.INITIALIZED }, t);
    const newJob = await this.jobService.updateJob(
      job.id,
      {
        currentStatusId: status.id,
      },
      t
    );

    return newJob;
  }
}
