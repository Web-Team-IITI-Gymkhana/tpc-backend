/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import * as XLSX from "xlsx";
import * as fs from "fs";
import { InjectModel } from "@nestjs/sequelize";
import {
  CompanyModel,
  JobModel,
  OnCampusOfferModel,
  ProgramModel,
  RecruiterModel,
  SalaryModel,
  SeasonModel,
  StudentModel,
  UserModel,
} from "../db/models";
import {
  CategoryEnum,
  CompanyCategoryEnum,
  CourseEnum,
  GenderEnum,
  JobStatusTypeEnum,
  OfferStatusEnum,
  RoleEnum,
} from "../enums";
import { JobRegistrationEnum } from "../enums/jobRegistration.enum";

interface IPPORowType {
  sNo: number;
  name: string;
  officialEmail: string;
  rollNumber?: string;
  department: string;
  programYear?: string;
  course?: CourseEnum;
  gender: string;
  dateOfBirth?: string;
  personalEmail?: string;
  category: string;
  contactNo: string;

  // Internship data
  internshipCompany: string;
  stipendPerMonth: number;
  internOthers?: number;

  // PPO data
  ppoCtcLakhs?: number;
  ppoOfferDate?: string;

  // Final offer data
  finalCompany: string;
  finalRole: string;
  final1stYearCtcLakhs: number;
  finalOverallCtcLakhs: number;

  offerStatus?: OfferStatusEnum;
  seasonId?: string;

  // For internal use
  programId?: string;
}

@Injectable()
export class PPOUploadService {
  constructor(
    @InjectModel(ProgramModel) private readonly programRepo: typeof ProgramModel,
    @InjectModel(JobModel) private readonly jobRepo: typeof JobModel,
    @InjectModel(SalaryModel) private readonly salaryRepo: typeof SalaryModel,
    @InjectModel(OnCampusOfferModel) private readonly onCampusOfferRepo: typeof OnCampusOfferModel,
    @InjectModel(CompanyModel) private readonly companyRepo: typeof CompanyModel,
    @InjectModel(RecruiterModel) private readonly recruiterRepo: typeof RecruiterModel,
    @InjectModel(SeasonModel) private readonly seasonRepo: typeof SeasonModel,
    @InjectModel(UserModel) private readonly userRepo: typeof UserModel,
    @InjectModel(StudentModel) private readonly studentRepo: typeof StudentModel
  ) {}

  /**
   * Parse category from string to enum
   */
  private parseCategory(category: string): CategoryEnum {
    const normalized = category.toLowerCase().trim();
    switch (normalized) {
      case "gen":
      case "general":
        return CategoryEnum.GENERAL;
      case "obc":
      case "obc_nc":
      case "obc-nc":
        return CategoryEnum.OBC;
      case "sc":
        return CategoryEnum.SC;
      case "st":
        return CategoryEnum.ST;
      case "ews":
        return CategoryEnum.EWS;
      default:
        console.warn(`Unknown category: ${category}, defaulting to GENERAL`);
        return CategoryEnum.GENERAL;
    }
  }

  /**
   * Parse gender from string to enum
   */
  private parseGender(gender: string): GenderEnum {
    const normalized = gender.toUpperCase().trim();
    switch (normalized) {
      case "M":
      case "MALE":
        return GenderEnum.MALE;
      case "F":
      case "FEMALE":
        return GenderEnum.FEMALE;
      default:
        return GenderEnum.OTHER;
    }
  }

  /**
   * Parse offer status from string to enum
   */
  private parseOfferStatus(status?: string): OfferStatusEnum {
    if (!status) return OfferStatusEnum.ACCEPTED;

    const normalized = status.toUpperCase().trim();
    switch (normalized) {
      case "ACCEPTED":
      case "ACCEPT":
        return OfferStatusEnum.ACCEPTED;
      case "REJECTED":
      case "REJECT":
        return OfferStatusEnum.REJECTED;
      case "ONGOING":
      case "PENDING":
        return OfferStatusEnum.ONGOING;
      default:
        return OfferStatusEnum.ACCEPTED;
    }
  }

  private normalizeEmail(email?: string): string {
    return (email || "").trim().toLowerCase();
  }

  /**
   * Find program by branch, year, and course
   */
  private async findProgramId(branch: string, year: string, course: CourseEnum): Promise<string | null> {
    const program = await this.programRepo.findOne({
      where: {
        branch: branch,
        course: course,
        year: year,
      },
    });

    return program ? program.id : null;
  }

  /**
   * Find or create student
   */
  private async findOrCreateStudent(data: IPPORowType, seasonId: string): Promise<StudentModel> {
    // Try to find by roll number first
    if (data.rollNumber) {
      const existing = await this.studentRepo.findOne({
        where: { rollNo: data.rollNumber },
        include: [{ model: UserModel, as: "user" }],
      });

      if (existing) {
        console.log(`  Found existing student: ${data.rollNumber}`);
        return existing;
      }
    }

    const normalizedEmail = this.normalizeEmail(data.officialEmail);

    // Try to find by email
    const existingUser = await this.userRepo.findOne({
      where: { email: normalizedEmail, role: RoleEnum.STUDENT },
    });

    if (existingUser) {
      const existingStudent = await this.studentRepo.findOne({
        where: { userId: existingUser.id },
        include: [{ model: UserModel, as: "user" }],
      });

      if (existingStudent) {
        console.log(`  Found existing student by email: ${normalizedEmail}`);
        return existingStudent;
      }

      const student = await this.studentRepo.create({
        userId: existingUser.id,
        programId: data.programId!,
        rollNo: data.rollNumber || `TEMP-${Date.now()}`,
        category: this.parseCategory(data.category),
        gender: this.parseGender(data.gender),
        cpi: 0, // Default, should be updated later
      });

      console.log(`  Created missing student profile for: ${normalizedEmail}`);
      return student;
    }

    // Create new student
    console.log(`  Creating new student: ${data.name}`);

    const [user] = await this.userRepo.findOrCreate({
      where: { email: normalizedEmail, role: RoleEnum.STUDENT },
      defaults: {
        name: data.name,
        email: normalizedEmail,
        contact: data.contactNo,
        role: RoleEnum.STUDENT,
      },
    });

    const student = await this.studentRepo.create({
      userId: user.id,
      programId: data.programId!,
      rollNo: data.rollNumber || `TEMP-${Date.now()}`,
      category: this.parseCategory(data.category),
      gender: this.parseGender(data.gender),
      cpi: 0, // Default, should be updated later
    });

    return student;
  }

  /**
   * Find or create company
   */
  private async findOrCreateCompany(companyName: string): Promise<CompanyModel> {
    const [company] = await this.companyRepo.findOrCreate({
      where: { name: companyName.trim() },
      defaults: {
        category: CompanyCategoryEnum.MNC,
        yearOfEstablishment: new Date().getFullYear().toString(),
      },
    });

    return company;
  }

  private async findExistingOffer(
    studentId: string,
    companyName: string,
    role: string,
    seasonId: string
  ): Promise<OnCampusOfferModel | null> {
    return this.onCampusOfferRepo.findOne({
      where: { studentId },
      include: [
        {
          model: SalaryModel,
          required: true,
          include: [
            {
              model: JobModel,
              required: true,
              where: { seasonId, role },
              include: [
                {
                  model: CompanyModel,
                  required: true,
                  where: { name: companyName.trim() },
                },
              ],
            },
          ],
        },
      ],
    });
  }

  /**
   * Create recruiter for company
   */
  private async createRecruiter(company: CompanyModel): Promise<RecruiterModel> {
    // Check if recruiter already exists for this company
    const existing = await this.recruiterRepo.findOne({
      where: { companyId: company.id },
    });

    if (existing) {
      return existing;
    }

    // Create dummy user for recruiter
    const safeEmail = `recruiter.${company.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@system.generated`;

    const recruiterUser = await this.userRepo.create({
      name: `${company.name} - Placement Coordinator`,
      email: safeEmail,
      contact: "0000000000",
      role: RoleEnum.RECRUITER,
    });

    const recruiter = await this.recruiterRepo.create({
      userId: recruiterUser.id,
      companyId: company.id,
      designation: "Placement Coordinator",
    });

    return recruiter;
  }

  /**
   * Create job for PPO
   */
  private async createPPOJob(
    company: CompanyModel,
    recruiter: RecruiterModel,
    seasonId: string,
    role: string
  ): Promise<JobModel> {
    const job = await this.jobRepo.create({
      seasonId: seasonId,
      companyId: company.id,
      recruiterId: recruiter.id,
      role: role || "Not Specified",
      location: "India",
      active: false, // PPO process is complete
      currentStatus: JobStatusTypeEnum.RECRUITMENT_PROCESS_COMPLELETED,
      registration: JobRegistrationEnum.CLOSED,
    });

    return job;
  }

  /**
   * Create salary record
   */
  private async createSalary(
    job: JobModel,
    data: IPPORowType
  ): Promise<SalaryModel> {
    // Convert lakhs to rupees
    const totalCTC = Math.floor(data.finalOverallCtcLakhs * 100000);
    const baseSalary = data.final1stYearCtcLakhs ? Math.floor(data.final1stYearCtcLakhs * 100000) : totalCTC;

    const salary = await this.salaryRepo.create({
      jobId: job.id,
      totalCTC: totalCTC,
      baseSalary: baseSalary,
      salaryPeriod: "PER_ANNUM",
      others: data.internOthers ? data.internOthers.toString() : undefined,
    });

    return salary;
  }

  /**
   * Create OnCampusOffer (visible in dashboard)
   */
  private async createOnCampusOffer(
    student: StudentModel,
    salary: SalaryModel,
    data: IPPORowType
  ): Promise<OnCampusOfferModel> {
    const metadata = {
      ppoFromCompany: data.internshipCompany,
      ppoOfferDate: data.ppoOfferDate,
      internStipend: data.stipendPerMonth,
      internOthers: data.internOthers,
      source: "PPO_IMPORT",
      importDate: new Date().toISOString(),
    };

    const offer = await this.onCampusOfferRepo.create({
      studentId: student.id,
      salaryId: salary.id,
      status: this.parseOfferStatus(data.offerStatus),
      metadata: JSON.stringify(metadata),
    });

    return offer;
  }

  /**
   * Main upload function for PPO data
   */
  async uploadPPOFromExcel(filePath: string, seasonId: string, year?: string, course?: string): Promise<void> {
    console.log("🚀 Starting PPO data upload...");
    console.log(`📁 File: ${filePath}`);
    console.log(`🏫 Season ID: ${seasonId}`);

    // Validate file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Validate season exists
    const season = await this.seasonRepo.findByPk(seasonId);
    if (!season) {
      throw new Error(`Season not found with ID: ${seasonId}`);
    }

    console.log(`✅ Season validated: ${season.type} ${season.year}`);

    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Parse data
    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const [headerRow, ...dataRows] = rawRows;

    console.log(`📊 Found ${dataRows.length} rows to process`);
    console.log(`📋 Headers: ${headerRow.join(", ")}`);

    // Column mapping (adjust indices based on your CSV structure)
    const columnMap: { [index: number]: keyof IPPORowType } = {
      0: "sNo",
      1: "name",
      2: "officialEmail",
      3: "department",
      4: "gender",
      5: "dateOfBirth",
      6: "personalEmail",
      7: "category",
      8: "contactNo",
      9: "internshipCompany",
      10: "stipendPerMonth",
      11: "internOthers",
      12: "ppoCtcLakhs",
      13: "ppoOfferDate",
      14: "finalCompany",
      15: "finalRole",
      16: "final1stYearCtcLakhs",
      17: "finalOverallCtcLakhs",
    };

    // Parse data rows
    const data: IPPORowType[] = dataRows
      .map((row, rowIndex) => {
        const mapped: any = {};

        Object.entries(columnMap).forEach(([index, fieldName]) => {
          mapped[fieldName] = row[+index];
        });

        return mapped as IPPORowType;
      })
      .filter((row) => row.name && row.finalCompany); // Filter incomplete rows

    console.log(`✅ Parsed ${data.length} valid PPO records`);

    // Process each record
    let successCount = 0;
    let errorCount = 0;

    for (const row of data) {
      try {
        console.log(`\n📝 Processing S.No ${row.sNo}: ${row.name}`);

        // Find program ID
        if (year && course) {
          const programId = await this.findProgramId(row.department, year, course as CourseEnum);
          if (!programId) {
            console.error(`  ❌ Program not found for ${row.department} - ${year} - ${course}`);
            errorCount++;
            continue;
          }
          row.programId = programId;
        }

        // 1. Find or create student
        const student = await this.findOrCreateStudent(row, seasonId);

        // 1b. Skip if offer already exists for this student/company/role/season
        const existingOffer = await this.findExistingOffer(student.id, row.finalCompany, row.finalRole, seasonId);
        if (existingOffer) {
          console.log(`  ⏭️  Offer already exists. Skipping duplicate for ${row.finalCompany} - ${row.finalRole}`);
          successCount++;
          continue;
        }

        // 2. Find or create company
        const company = await this.findOrCreateCompany(row.finalCompany);
        console.log(`  ✓ Company: ${company.name}`);

        // 3. Create recruiter
        const recruiter = await this.createRecruiter(company);
        console.log(`  ✓ Recruiter created/found`);

        // 4. Create job
        const job = await this.createPPOJob(company, recruiter, seasonId, row.finalRole);
        console.log(`  ✓ Job created: ${job.role}`);

        // 5. Create salary
        const salary = await this.createSalary(job, row);
        console.log(`  ✓ Salary created: ₹${salary.totalCTC}`);

        // 6. Create OnCampusOffer
        const offer = await this.createOnCampusOffer(student, salary, row);
        console.log(`  ✅ OnCampusOffer created: ${offer.id}`);

        successCount++;
      } catch (error) {
        console.error(`  ❌ Failed to process row ${row.sNo}:`, error);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ PPO Upload Complete!`);
    console.log(`   Success: ${successCount} records`);
    console.log(`   Errors: ${errorCount} records`);
    console.log("=".repeat(60));
  }
}
