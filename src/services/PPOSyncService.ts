/* eslint-disable no-console */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as fs from "fs";
import * as XLSX from "xlsx";
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
  DepartmentEnum,
  GenderEnum,
  JobStatusTypeEnum,
  OfferStatusEnum,
  RoleEnum,
} from "../enums";
import { JobRegistrationEnum } from "../enums/jobRegistration.enum";

interface PPORow {
  sNo: string;
  name: string;
  rollNo: string;
  officialEmail: string;
  department: string;
  gender: string;
  dateOfBirth: string;
  personalEmail: string;
  category: string;
  contactNo: string;
  internshipCompany: string;
  stipendPerMonth: number;
  internOthers?: number;
  ppoCtcLakhs?: number;
  ppoOfferDate: string;
  finalCompany: string;
  finalRole: string;
  finalFirstYearCtcLakhs?: number;
  finalOverallCtcLakhs?: number;
}

interface UploadStats {
  total: number;
  success: number;
  skipped: number;
  failed: number;
}

@Injectable()
export class PPOSyncService {
  constructor(
    @InjectModel(StudentModel) private readonly studentRepo: typeof StudentModel,
    @InjectModel(OnCampusOfferModel) private readonly onCampusOfferRepo: typeof OnCampusOfferModel,
    @InjectModel(SalaryModel) private readonly salaryRepo: typeof SalaryModel,
    @InjectModel(ProgramModel) private readonly programRepo: typeof ProgramModel,
    @InjectModel(JobModel) private readonly jobRepo: typeof JobModel,
    @InjectModel(CompanyModel) private readonly companyRepo: typeof CompanyModel,
    @InjectModel(RecruiterModel) private readonly recruiterRepo: typeof RecruiterModel,
    @InjectModel(SeasonModel) private readonly seasonRepo: typeof SeasonModel,
    @InjectModel(UserModel) private readonly userRepo: typeof UserModel
  ) {}

  private normalizeRollNo(rollNo?: string | number): string | null {
    if (rollNo === undefined || rollNo === null) return null;
    const normalized = rollNo.toString().trim().toLowerCase();
    return normalized || null;
  }

  private normalizeEmail(email?: string): string {
    return (email || "").trim().toLowerCase();
  }

  private parseNumber(value: unknown): number | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private parseCategory(category?: string): CategoryEnum {
    const normalized = (category || "").toLowerCase().trim();
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
        console.warn(`Unknown category: ${category || "(blank)"}, defaulting to GENERAL`);
        return CategoryEnum.GENERAL;
    }
  }

  private parseGender(gender?: string): GenderEnum {
    const normalized = (gender || "").toUpperCase().trim();
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

  private parseDepartment(department?: string): DepartmentEnum | undefined {
    const normalized = (department || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const entries = Object.entries(DepartmentEnum) as [string, DepartmentEnum][];

    return entries.find(([key, value]) => {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]/g, "");
      return normalized === normalizedKey || normalized === normalizedValue;
    })?.[1];
  }

  private inferCourse(row: PPORow): CourseEnum {
    const rollNo = this.normalizeRollNo(row.rollNo) || "";
    const email = this.normalizeEmail(row.officialEmail);

    if (/^\d{9}$/.test(rollNo) || /^[a-z]{2,4}\d{9}@/.test(email)) {
      return CourseEnum.BTECH;
    }

    return CourseEnum.BTECH;
  }

  private parseCSV(filePath: string): PPORow[] {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });

    // CSV order: S NO, Name, rollNo, Official Email, Department, ...
    return rawRows
      .slice(1)
      .filter((row) => Array.isArray(row) && row.length > 2 && row[2])
      .map(
        (row): PPORow => ({
          sNo: String(row[0] ?? ""),
          name: String(row[1] ?? "").trim(),
          rollNo: String(row[2] ?? "").trim(),
          officialEmail: String(row[3] ?? "").trim(),
          department: String(row[4] ?? "").trim(),
          gender: String(row[5] ?? "").trim(),
          dateOfBirth: String(row[6] ?? "").trim(),
          personalEmail: String(row[7] ?? "").trim(),
          category: String(row[8] ?? "").trim(),
          contactNo: String(row[9] ?? "").trim(),
          internshipCompany: String(row[10] ?? "").trim(),
          stipendPerMonth: this.parseNumber(row[11]) ?? 0,
          internOthers: this.parseNumber(row[12]),
          ppoCtcLakhs: this.parseNumber(row[13]),
          ppoOfferDate: String(row[14] ?? "").trim(),
          finalCompany: String(row[15] ?? "").trim(),
          finalRole: String(row[16] ?? "").trim(),
          finalFirstYearCtcLakhs: this.parseNumber(row[17]),
          finalOverallCtcLakhs: this.parseNumber(row[18]),
        })
      );
  }

  private async findProgramForStudent(row: PPORow, placementSeason: SeasonModel): Promise<ProgramModel | null> {
    const department = this.parseDepartment(row.department);
    if (!department) return null;

    const course = this.inferCourse(row);

    const programForSeason = await this.programRepo.findOne({
      where: { department, course, year: placementSeason.year },
    });
    if (programForSeason) return programForSeason;

    const programForCourse = await this.programRepo.findOne({
      where: { department, course },
    });
    if (programForCourse) return programForCourse;

    return this.programRepo.findOne({ where: { department } });
  }

  private async findOrCreateStudent(row: PPORow, placementSeason: SeasonModel): Promise<StudentModel> {
    const rollNo = this.normalizeRollNo(row.rollNo);
    if (!rollNo) {
      throw new Error(`missing roll number for "${row.name || row.officialEmail}"`);
    }

    const studentByRollNo = await this.studentRepo.findOne({
      where: { rollNo },
      include: [{ model: UserModel, as: "user" }],
    });
    if (studentByRollNo) return studentByRollNo;

    const email = this.normalizeEmail(row.officialEmail) || `${rollNo}@ppo-import.local`;
    const existingUser = await this.userRepo.findOne({
      where: { email, role: RoleEnum.STUDENT },
    });

    if (existingUser) {
      const studentByUser = await this.studentRepo.findOne({
        where: { userId: existingUser.id },
        include: [{ model: UserModel, as: "user" }],
      });
      if (studentByUser) return studentByUser;
    }

    const program = await this.findProgramForStudent(row, placementSeason);
    if (!program) {
      throw new Error(
        `cannot create student ${rollNo}: no program found for department "${row.department}" and placement year ${placementSeason.year}`
      );
    }

    const [user] = await this.userRepo.findOrCreate({
      where: { email, role: RoleEnum.STUDENT },
      defaults: {
        name: row.name || rollNo,
        email,
        contact: row.contactNo || "0000000000",
        role: RoleEnum.STUDENT,
      },
    });

    const student = await this.studentRepo.create({
      userId: user.id,
      programId: program.id,
      rollNo,
      category: this.parseCategory(row.category),
      gender: this.parseGender(row.gender),
      cpi: 0,
    });

    console.log(`[PPO Upload] Created missing student Roll ${rollNo}`);
    return student;
  }

  private async findInternOffer(studentId: string, internSeasonId: string): Promise<OnCampusOfferModel | null> {
    return this.onCampusOfferRepo.findOne({
      where: { studentId },
      include: [
        {
          model: SalaryModel,
          as: "salary",
          required: true,
          include: [
            {
              model: JobModel,
              as: "job",
              required: true,
              where: { seasonId: internSeasonId },
            },
          ],
        },
      ],
    });
  }

  private async findPlacementOffer(studentId: string, placementSeasonId: string): Promise<OnCampusOfferModel | null> {
    return this.onCampusOfferRepo.findOne({
      where: { studentId },
      include: [
        {
          model: SalaryModel,
          as: "salary",
          required: true,
          include: [
            {
              model: JobModel,
              as: "job",
              required: true,
              where: { seasonId: placementSeasonId },
            },
          ],
        },
      ],
    });
  }

  private async findOrCreateCompany(companyName: string): Promise<CompanyModel> {
    const trimmedName = companyName.trim();
    if (!trimmedName) {
      throw new Error("missing final company name");
    }

    const [company] = await this.companyRepo.findOrCreate({
      where: { name: trimmedName },
      defaults: {
        category: CompanyCategoryEnum.MNC,
        yearOfEstablishment: new Date().getFullYear().toString(),
      },
    });

    return company;
  }

  private async createRecruiter(company: CompanyModel): Promise<RecruiterModel> {
    const existingRecruiter = await this.recruiterRepo.findOne({
      where: { companyId: company.id },
    });
    if (existingRecruiter) return existingRecruiter;

    const safeCompanyName = company.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const email = `recruiter.${safeCompanyName || company.id}@system.generated`;
    const [user] = await this.userRepo.findOrCreate({
      where: { email, role: RoleEnum.RECRUITER },
      defaults: {
        name: `${company.name} - Placement Coordinator`,
        email,
        contact: "0000000000",
        role: RoleEnum.RECRUITER,
      },
    });

    return this.recruiterRepo.create({
      userId: user.id,
      companyId: company.id,
      designation: "Placement Coordinator",
    });
  }

  private async createPPOJob(
    company: CompanyModel,
    recruiter: RecruiterModel,
    placementSeasonId: string,
    role: string
  ): Promise<JobModel> {
    return this.jobRepo.create({
      seasonId: placementSeasonId,
      companyId: company.id,
      recruiterId: recruiter.id,
      role: role || "Not Specified",
      location: "India",
      active: false,
      currentStatus: JobStatusTypeEnum.RECRUITMENT_PROCESS_COMPLELETED,
      registration: JobRegistrationEnum.CLOSED,
    });
  }

  private async findSalaryForPlacementCompany(
    companyName: string,
    role: string,
    placementSeasonId: string
  ): Promise<SalaryModel | null> {
    return this.salaryRepo.findOne({
      include: [
        {
          model: JobModel,
          as: "job",
          required: true,
          where: { seasonId: placementSeasonId, role: role || "Not Specified" },
          include: [
            {
              model: CompanyModel,
              as: "company",
              required: true,
              where: { name: companyName.trim() },
            },
          ],
        },
      ],
    });
  }

  private async createSalary(job: JobModel, row: PPORow, student: StudentModel): Promise<SalaryModel> {
    const totalCtc = Math.floor((row.finalOverallCtcLakhs ?? row.finalFirstYearCtcLakhs ?? 0) * 100000);
    const firstYearCtc = Math.floor((row.finalFirstYearCtcLakhs ?? row.finalOverallCtcLakhs ?? 0) * 100000);

    return this.salaryRepo.create({
      jobId: job.id,
      totalCTC: totalCtc,
      firstYearCTC: firstYearCtc,
      baseSalary: firstYearCtc,
      salaryPeriod: "PER_ANNUM",
      others: row.internOthers?.toString(),
      programs: [student.programId],
      genders: [this.parseGender(row.gender)],
      categories: [this.parseCategory(row.category)],
      departments: this.parseDepartment(row.department) ? [this.parseDepartment(row.department)!] : undefined,
    });
  }

  private async findOrCreatePlacementSalary(
    row: PPORow,
    placementSeasonId: string,
    student: StudentModel
  ): Promise<SalaryModel> {
    const existingSalary = await this.findSalaryForPlacementCompany(row.finalCompany, row.finalRole, placementSeasonId);
    if (existingSalary) return existingSalary;

    const company = await this.findOrCreateCompany(row.finalCompany);
    const recruiter = await this.createRecruiter(company);
    const job = await this.createPPOJob(company, recruiter, placementSeasonId, row.finalRole);
    const salary = await this.createSalary(job, row, student);

    console.log(`[PPO Upload] Created placement job/salary for ${row.finalCompany} - ${row.finalRole}`);
    return salary;
  }

  private async createOnCampusOffer(
    student: StudentModel,
    salary: SalaryModel,
    row: PPORow
  ): Promise<OnCampusOfferModel> {
    const metadata = {
      ppoFromCompany: row.internshipCompany,
      ppoOfferDate: row.ppoOfferDate,
      ppoCtcLakhs: row.ppoCtcLakhs,
      internStipend: row.stipendPerMonth,
      internOthers: row.internOthers,
      source: "PPO_SYNC_IMPORT",
      importDate: new Date().toISOString(),
    };

    return this.onCampusOfferRepo.create({
      studentId: student.id,
      salaryId: salary.id,
      status: OfferStatusEnum.PLACEMENT_PPO,
      metadata: JSON.stringify(metadata),
    });
  }

  // Returns "success" | "skipped". Throws for error conditions so the
  // caller's try/catch counts them as failures.
  private async processRow(
    row: PPORow,
    internSeasonId: string,
    placementSeason: SeasonModel
  ): Promise<"success" | "skipped"> {
    const rollNo = this.normalizeRollNo(row.rollNo);
    if (!rollNo) {
      console.warn(`[PPO Upload] SKIP (missing roll number): ${row.name || row.officialEmail}`);
      return "skipped";
    }

    // Step 1: find or create the student/profile data needed by the offer flow.
    const student = await this.findOrCreateStudent(row, placementSeason);

    // Step 2: PPO sync is valid only when the intern-season offer exists.
    const internOffer = await this.findInternOffer(student.id, internSeasonId);
    if (!internOffer) {
      console.warn(`[PPO Upload] SKIP Roll ${rollNo}: no intern offer found in season ${internSeasonId}`);
      return "skipped";
    }

    // Step 3: mark intern offer as PPO_ACCEPTED (idempotent).
    if (internOffer.status !== OfferStatusEnum.PPO_ACCEPTED) {
      await internOffer.update({ status: OfferStatusEnum.PPO_ACCEPTED });
    }

    // Step 4: preserve the original sync behavior: any placement-season offer
    // means we do not create another placement offer for this student.
    const existingPlacement = await this.findPlacementOffer(student.id, placementSeason.id);
    if (existingPlacement) {
      if (existingPlacement.status === OfferStatusEnum.PLACEMENT_PPO) {
        console.log(`[PPO Upload] SKIP Roll ${rollNo}: placement PPO offer already exists`);
      } else {
        console.warn(
          `[PPO Upload] SKIP Roll ${rollNo}: placement offer already exists with status ${existingPlacement.status}`
        );
      }
      return "skipped";
    }

    // Step 5: reuse placement salary if present; otherwise create company,
    // recruiter, job, and salary from this PPO row.
    const salary = await this.findOrCreatePlacementSalary(row, placementSeason.id, student);

    // Step 6: create the placement PPO offer.
    await this.createOnCampusOffer(student, salary, row);

    console.log(`[PPO Upload] OK   Roll ${rollNo}: placement PPO offer created`);
    return "success";
  }

  async syncPPOData(internSeasonId: string, placementSeasonId: string, filePath: string): Promise<void> {
    console.log("=".repeat(60));
    console.log("PPO Sync");
    console.log(`  Intern season    : ${internSeasonId}`);
    console.log(`  Placement season : ${placementSeasonId}`);
    console.log(`  File             : ${filePath}`);
    console.log("=".repeat(60));

    const [internSeason, placementSeason] = await Promise.all([
      this.seasonRepo.findByPk(internSeasonId),
      this.seasonRepo.findByPk(placementSeasonId),
    ]);

    if (!internSeason) {
      throw new Error(`Intern season not found: ${internSeasonId}`);
    }
    if (!placementSeason) {
      throw new Error(`Placement season not found: ${placementSeasonId}`);
    }

    const rows = this.parseCSV(filePath);
    console.log(`Parsed ${rows.length} data rows\n`);

    const stats: UploadStats = { total: rows.length, success: 0, skipped: 0, failed: 0 };

    for (const row of rows) {
      const rollNo = this.normalizeRollNo(row.rollNo) ?? row.officialEmail;
      try {
        const result = await this.processRow(row, internSeason.id, placementSeason);
        if (result === "success") {
          stats.success++;
        } else {
          stats.skipped++;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[PPO Upload Error] Roll ${rollNo}: ${message}`);
        stats.failed++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(
      `Total: ${stats.total} | Success: ${stats.success} | Skipped: ${stats.skipped} | Failed: ${stats.failed}`
    );
    console.log("=".repeat(60));
  }
}
