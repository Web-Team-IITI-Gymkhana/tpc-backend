/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import * as XLSX from "xlsx";
import * as fs from "fs";
import { InjectModel } from "@nestjs/sequelize"; // Replace with actual model
import { PROGRAMS } from "../test/data"; // Adjust the import path as needed
import {
  CompanyModel,
  JobModel,
  OffCampusOfferModel,
  OnCampusOfferModel,
  ProgramModel,
  RecruiterModel,
  RegistrationModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  UserModel,
} from "../db/models"; // Adjust the import path as needed
import {
  BacklogEnum,
  CategoryEnum,
  CompanyCategoryEnum,
  CourseEnum,
  GenderEnum,
  JobStatusTypeEnum,
  OfferStatusEnum,
  RoleEnum,
  SeasonTypeEnum,
} from "../enums";
import { JobRegistrationEnum } from "../enums/jobRegistration.enum";
import { faker } from "@faker-js/faker";

interface IRowType {
  sNo: number;
  rollNumber: string;
  officialEmail: string;
  name: string;
  aggregateCPI: number;
  category: string;
  department: string;
  gender: string;
  personalEmail: string;
  contactNo: string;
  phone1: string;
  stipendPerMonth: string;
  companyOrInstitute: string;
  jobRoleIntern: string;
  ppoCtcFirstYear: string;
  ppoCtcTotal: string;
  fteCompany: string;
  fteJobRole: string;
  fteCtcFirstYear: number;
  fteCtcTotal: number;
  finalOverallCtc: number;
  [key: string]: any; // <--- this line allows dynamic assignment
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
    @InjectModel(RegistrationModel) private readonly registrationRepo: typeof RegistrationModel,
    @InjectModel(StudentModel) private readonly studentRepo: typeof StudentModel
  ) {}

  async findProgramIdByName(branch: string, year: string, course: CourseEnum): Promise<string | null> {
    const program = await this.programRepo.findOne({
      where: {
        branch: branch,
        course: course,
        year: year,
      },
    });

    return program ? program.id : null;
  }

  changeCategory(category: string): CategoryEnum {
    switch (category) {
      case "gen":
        return CategoryEnum.GENERAL;
      case "obc_nc":
        return CategoryEnum.OBC;
      case "sc":
        return CategoryEnum.SC;
      case "st":
        return CategoryEnum.ST;
      default:
        return CategoryEnum.GENERAL;
    }
  }

  changeGender(gender: string): GenderEnum {
    switch (gender) {
      case "M":
        return GenderEnum.MALE;
      case "F":
        return GenderEnum.FEMALE;
      default:
        return GenderEnum.OTHER;
    }
  }

  changeCTC(ctc: number | null): number {
    if (!ctc) return 0;

    // You can add additional logic here to parse the string if needed
    return ctc;
  }

  changeJobRole(role: string): string {
    if (!role) return "Not Provided";

    return role;
  }

  async CreateStudent(data: any, seasonId: string) {
    const user = await this.userRepo.create({
      name: data.name,
      email: data.officialEmail,
      contact: data.contactNo,
      role: RoleEnum.STUDENT,
    });
    const student = await this.studentRepo.create({
      userId: user.id,
      programId: data.programId,
      rollNo: data.rollNumber,
      category: this.changeCategory(data.category),
      gender: this.changeGender(data.gender),
      cpi: data.aggregateCPI,
      backlog: null,
      tenthMarks: null,
      twelthMarks: null,
    });

    const registration = await this.registrationRepo.create({
      studentId: student.id,
      seasonId: seasonId,
      registered: true,
    });

    console.log(`Student created with ID: ${student.id}`);

    return student.id;
  }

  async createDummyUserForRecruiter() {
    const user = await this.userRepo.create({
      name: "Dummy Recruiter",
      email: faker.internet.email(),
      contact: "1234567890",
      role: RoleEnum.RECRUITER,
    });

    return user.id;
  }

  async CreateRecuiter(data: any, recruiterUserId: string) {
    const company = await this.companyRepo.findOrCreate({
      where: {
        name: data.fteCompany,
      },
      defaults: {
        category: CompanyCategoryEnum.MNC,
        yearOfEstablishment: "2025",
      },
    });

    console.log(`Company created with ID: ${company[0].id}`);
    const [recruiter] = await this.recruiterRepo.findOrCreate({
      where: { companyId: company[0].id },
      defaults: {
        userId: recruiterUserId,
        designation: "Head Recruiter",
      },
    });

    return recruiter;
  }

  async CreateJob(data: any, recruiter: any, seasonId: string) {
    const season = await this.seasonRepo.findByPk(seasonId);
    const job = await this.jobRepo.create({
      seasonId: seasonId,
      companyId: recruiter.companyId,
      recruiterId: recruiter.id,
      role: this.changeJobRole(data.fteJobRole),
      location: "Bangalore",
      active: true,
      currentStatus: JobStatusTypeEnum.RECRUITMENT_PROCESS_COMPLELETED,
      registration: JobRegistrationEnum.CLOSED,
    });
    if (season.type === SeasonTypeEnum.PLACEMENT) {
      const salary = await this.salaryRepo.create({
        jobId: job.id,
        totalCTC: Math.floor(this.changeCTC(data.fteCtcTotal) * 100000),
      });

      return salary.id;
    } else {
      const salary = await this.salaryRepo.create({
        jobId: job.id,
        stipend: data.stipendPerMonth,
      });

      return salary.id;
    }
  }

  async CreateOnCampusOffer(studentId: string, salaryId: string) {
    const offer = await this.onCampusOfferRepo.create({
      studentId: studentId,
      salaryId: salaryId,
      status: OfferStatusEnum.ACCEPTED,
    });

    console.log(`On-campus offer created with ID: ${offer.id}`);

    return offer.id;
  }

  async uploadFromExcel(filePath: string, year: string, course: string, seasonId: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Parse the sheet into raw rows including the header
    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // `header: 1` gives rows as arrays

    // Extract header row and sanitize
    const [headerRow, ...dataRows] = rawRows;

    // Sanitize the header row: remove extra spaces and newline characters
    const sanitizedHeaderRow = headerRow.map((header) => header.replace(/[\r\n]+/g, " ").trim());

    console.log("Sanitized Header Row:", sanitizedHeaderRow);

    // Define mapping based on column indices (adjust if necessary)
    const columnMap: { [index: number]: keyof IRowType } = {
      0: "sNo",
      1: "rollNumber",
      2: "officialEmail",
      3: "name",
      4: "aggregateCPI",
      5: "category",
      6: "department", // branch column
      7: "gender",
      8: "personalEmail",
      9: "contactNo",
      10: "phone1",
      11: "stipendPerMonth",
      12: "companyOrInstitute",
      13: "jobRoleIntern",
      14: "ppoCtcFirstYear",
      15: "ppoCtcTotal",
      16: "fteCompany",
      17: "fteJobRole",
      18: "fteCtcFirstYear",
      19: "fteCtcTotal",
      20: "finalOverallCtc",
    };

    // Extract and map data, with validation to ensure no undefined values are passed
    const data: IRowType[] = dataRows.map((row, rowIndex) => {
      const mapped: Partial<IRowType> = {};

      Object.entries(columnMap).forEach(([index, fieldName]) => {
        mapped[fieldName] = row[+index]; // +index ensures it's treated as a number
      });

      return mapped as IRowType;
    }); // Filter out any rows with critical missing data

    console.log(data);

    const dummyRecruiterUserId = await this.createDummyUserForRecruiter();
    const programs = await this.programRepo.findAll();
    if (programs.length === 0) {
      await this.programRepo.bulkCreate(PROGRAMS);
    }

    for (const row of data) {
      const typedRow = row as IRowType;
      const { department } = typedRow;
      console.log("Raw Row:", typedRow);
      console.log("department (branch):", typedRow.department, "year:", year, "course:", course);
      // Note: This service appears to be mapping department field as branch - may need adjustment based on actual data structure
      const programId = await this.findProgramIdByName(department, year, course as CourseEnum);
      typedRow.programId = programId;
      const studentId = await this.CreateStudent(typedRow, seasonId);
      if (typedRow.fteCompany && typedRow.fteCompany.trim() !== "") {
        const recruiter = await this.CreateRecuiter(typedRow, dummyRecruiterUserId);
        const salaryId = await this.CreateJob(typedRow, recruiter, seasonId);
        const offer = await this.CreateOnCampusOffer(studentId, salaryId);

        console.log(`Offer created with ID: ${offer}`);
      }
    }

    console.log("Data upload complete!");
  }
}
