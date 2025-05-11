/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import * as XLSX from "xlsx";
import * as fs from "fs";
import { InjectModel } from "@nestjs/sequelize"; // Replace with actual model
import {
  CompanyModel,
  JobModel,
  OffCampusOfferModel,
  OnCampusOfferModel,
  ProgramModel,
  RecruiterModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  UserModel,
} from "src/db/models";
import {
  BacklogEnum,
  CategoryEnum,
  CompanyCategoryEnum,
  JobStatusTypeEnum,
  OfferStatusEnum,
  RoleEnum,
  SeasonTypeEnum,
} from "src/enums";
import { JobRegistrationEnum } from "src/enums/jobRegistration.enum";

interface IRowType {
  sNo: number;
  rollNumber: string;
  officialEmail: string;
  name: string;
  aggregateCPI: number;
  department: string;
  programId: string;
  gender: string;
  personalEmail: string;
  contactNo: string;
  phone1: string;
  stipendPerMonth: string;
  companyOrInstitute: string; // Off-Campus / Mitacs / DAAD / Etc.
  jobRoleIntern: string;
  ppoCtcFirstYear: string;
  ppoCtcTotal: string;
  fteCompany: string;
  fteJobRole: string;
  fteCtcFirstYear: string;
  fteCtcTotal: string;
  finalOverallCtc: string;
}

@Injectable()
export class DataUploadService {
  constructor(
    @InjectModel(ProgramModel) private readonly programRepo: typeof ProgramModel,
    @InjectModel(JobModel) private readonly jobRepo: typeof JobModel,
    @InjectModel(SalaryModel) private readonly salaryRepo: typeof SalaryModel,
    @InjectModel(OnCampusOfferModel) private readonly onCampusOfferRepo: typeof OnCampusOfferModel,
    @InjectModel(OffCampusOfferModel) private readonly offCampusOfferRepo: typeof OffCampusOfferModel,
    @InjectModel(CompanyModel) private readonly companyRepo: typeof CompanyModel,
    @InjectModel(RecruiterModel) private readonly recruiterRepo: typeof RecruiterModel,
    @InjectModel(SeasonModel) private readonly seasonRepo: typeof SeasonModel,
    @InjectModel(UserModel) private readonly userRepo: typeof UserModel,
    @InjectModel(StudentModel) private readonly studentRepo: typeof StudentModel
  ) {}

  async findProgramIdByName(branch: string, year: string, course: string): Promise<string | null> {
    const program = await this.programRepo.findOne({
      where: {
        branch: branch,
        course: course,
        year: year,
      },
    });

    return program ? program.id : null;
  }

  async CreateStudent(data: any) {
    const user = await this.userRepo.create({
      name: data.name,
      email: data.email,
      contact: data.contact,
      role: RoleEnum.STUDENT,
    });
    const student = await this.studentRepo.create({
      userId: user.id,
      programId: data.programId,
      rollNo: data.rollNo,
      category: data.category,
      gender: data.gender,
      cpi: data.cpi,
      backlog: BacklogEnum.NEVER,
      tenthMarks: 85,
      twelthMarks: 85,
    });

    console.log(`Student created with ID: ${student.id}`);

    return student.id;
  }

  async createDummyUserForRecruiter() {
    const user = await this.userRepo.create({
      name: "Dummy Recruiter",
      email: "recruiter@dummy.com",
      contact: "1234567890",
      role: RoleEnum.RECRUITER,
    });

    return user.id;
  }

  async CreateRecuiter(data: any, recruiterUserId: string) {
    const company = await this.companyRepo.create({
      name: data.name,
      category: CompanyCategoryEnum.MNC,
      yearOfEstablishment: "2025",
    });

    console.log(`Company created with ID: ${company.id}`);
    const recruiter = await this.recruiterRepo.create({
      userId: recruiterUserId,
      companyId: company.id,
      designation: "Head Recruiter",
    });

    return recruiter;
  }

  async CreateJob(data: any, recruiter: any, seasonId: string) {
    const season = await this.seasonRepo.findByPk(seasonId);
    const job = await this.jobRepo.create({
      seasonId: seasonId,
      companyId: recruiter.companyId,
      recruiterId: recruiter.id,
      role: data.jobRole,
      active: true,
      currentStatus: JobStatusTypeEnum.RECRUITMENT_PROCESS_COMPLELETED,
      registration: JobRegistrationEnum.CLOSED,
    });
    if (season.type === SeasonTypeEnum.PLACEMENT) {
      const salary = await this.salaryRepo.create({
        jobId: job.id,
        totalCTC: data.finalOverallCtc,
        firstYearCTC: data.fteCtcFirstYear,
      });
    } else {
      const salary = await this.salaryRepo.create({
        jobId: job.id,
        stipend: data.stipendPerMonth,
      });
    }
  }

  async CreateOnCampusOffer(studentId: string, salaryId: string) {
    const offer = await this.onCampusOfferRepo.create({
      studentId: studentId,
      salaryId: salaryId,
      status: OfferStatusEnum.ACCEPTED,
    });

    console.log(`On-campus offer created with ID: ${offer.id}`);
  }

  async uploadFromExcel(filePath: string, year: string, course: string, seasonId: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const dummyRecruiterUserId = await this.createDummyUserForRecruiter();

    for (const row of data) {
      const typedRow = row as IRowType;
      const { department } = typedRow;
      const programId = await this.findProgramIdByName(department, year, course);
      typedRow.programId = programId;
      const studentId = await this.CreateStudent(typedRow);
      const recruiter = await this.CreateRecuiter(typedRow, dummyRecruiterUserId);
    }

    console.log("Data upload complete!");
  }
}
