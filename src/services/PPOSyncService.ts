/* eslint-disable no-console */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "sequelize";
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

interface IPPORow {
  sNo: string;
  name: string;
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
  ppoCtc?: number;
  ppoOfferDate: string;
  finalCompany: string;
  finalRole: string;
  finalFirstYearCtc?: number;
  finalOverallCtc?: number;
}

const REQUIRED_PPO_COLUMNS: { column: number; header: string; field: keyof IPPORow }[] = [
  { column: 2, header: "Name", field: "name" },
  { column: 3, header: "Official Email", field: "officialEmail" },
  { column: 4, header: "Department", field: "department" },
  { column: 5, header: "Gender", field: "gender" },
  { column: 10, header: "Internship Company", field: "internshipCompany" },
  { column: 15, header: "FTE-Company Name Final offer", field: "finalCompany" },
];

interface IUploadStats {
  total: number;
  success: number;
  skipped: number;
  failed: number;
}

type PPOReportStatus = "created" | "success" | "skipped" | "failed" | "warning";

interface IPPOReportEntry {
  status: PPOReportStatus;
  rollNo: string;
  message: string;
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

  private report: IPPOReportEntry[] = [];

  private addReport(status: PPOReportStatus, rollNo: string, message: string): void {
    this.report.push({ status, rollNo: rollNo || "-", message });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;

    return String(error);
  }

  private printHeader(title: string, rows: [string, string][]): void {
    const width = 88;
    console.log("=".repeat(width));
    console.log(title);
    console.log("-".repeat(width));
    for (const [label, value] of rows) {
      console.log(`${label.padEnd(18)} : ${value}`);
    }
    console.log("=".repeat(width));
  }

  private truncate(value: string, length: number): string {
    if (value.length <= length) return value;

    return `${value.slice(0, length - 3)}...`;
  }

  private printReportEntries(title: string, entries: IPPOReportEntry[]): void {
    if (entries.length === 0) return;

    const statusWidth = 9;
    const rollWidth = 18;
    const messageWidth = 56;
    const divider = `+-${"-".repeat(statusWidth)}-+-${"-".repeat(rollWidth)}-+-${"-".repeat(messageWidth)}-+`;

    console.log("");
    console.log(title);
    console.log(divider);
    console.log(
      `| ${"Status".padEnd(statusWidth)} | ${"Roll/Email".padEnd(rollWidth)} | ${"Message".padEnd(messageWidth)} |`
    );
    console.log(divider);
    for (const entry of entries) {
      console.log(
        `| ${entry.status.toUpperCase().padEnd(statusWidth)} | ${this.truncate(entry.rollNo, rollWidth).padEnd(
          rollWidth
        )} | ${this.truncate(entry.message, messageWidth).padEnd(messageWidth)} |`
      );
    }
    console.log(divider);
  }

  private printFinalReport(stats: IUploadStats): void {
    const successes = this.report.filter(({ status }) => status === "success");
    const skipped = this.report.filter(({ status }) => status === "skipped");
    const failed = this.report.filter(({ status }) => status === "failed");
    const created = this.report.filter(({ status }) => status === "created");
    const warnings = this.report.filter(({ status }) => status === "warning");

    this.printHeader("PPO Sync Summary", [
      ["Total rows", stats.total.toString()],
      ["Success", stats.success.toString()],
      ["Skipped", stats.skipped.toString()],
      ["Failed", stats.failed.toString()],
      ["Created records", created.length.toString()],
      ["Warnings", warnings.length.toString()],
    ]);

    this.printReportEntries("Successful Rows", successes);
    this.printReportEntries("Skipped Rows", skipped);
    this.printReportEntries("Created Records", created);
    this.printReportEntries("Warnings", warnings);
    this.printReportEntries("Failed Rows", failed);
  }

  private parseRollNo(email?: string): string | null {
    const localPart = this.normalizeEmail(email).replace(/@iiti\.ac\.in$/, "");
    const match = localPart.match(/(\d+)$/);

    return match?.[1] ?? null;
  }

  private normalizeEmail(email?: string): string {
    return (email || "").trim().toLowerCase();
  }

  private parseNumber(value: unknown): number | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    const parsed =
      typeof value === "number"
        ? value
        : Number(
            String(value)
              .replace(/[,\s₹]/g, "")
              .trim()
          );

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private parseCtcRupees(value: unknown): number | undefined {
    const parsed = this.parseNumber(value);
    if (parsed === undefined) return undefined;

    return Math.floor(parsed > 1000 ? parsed : parsed * 100000);
  }

  private parseDate(value: unknown): string {
    if (value === undefined || value === null || value === "") return "";

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10);
    }

    if (typeof value === "number") {
      const excelDate = XLSX.SSF.parse_date_code(value);
      if (excelDate) {
        return this.formatDateParts(excelDate.y, excelDate.m, excelDate.d);
      }
    }

    const raw = String(value).trim();
    const numericValue = Number(raw);
    if (Number.isFinite(numericValue)) {
      const excelDate = XLSX.SSF.parse_date_code(numericValue);
      if (excelDate) {
        return this.formatDateParts(excelDate.y, excelDate.m, excelDate.d);
      }
    }

    const dateParts = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (dateParts) {
      const day = Number(dateParts[1]);
      const month = Number(dateParts[2]);
      const year = Number(dateParts[3].length === 2 ? `20${dateParts[3]}` : dateParts[3]);
      const formatted = this.formatDateParts(year, month, day);

      return formatted || raw;
    }

    const parsedDate = new Date(raw);

    return Number.isNaN(parsedDate.getTime()) ? raw : parsedDate.toISOString().slice(0, 10);
  }

  private formatDateParts(year: number, month: number, day: number): string {
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      return "";
    }

    return date.toISOString().slice(0, 10);
  }

  private parseCategory(category?: string): CategoryEnum {
    const normalized = (category || "").toLowerCase().trim();
    switch (normalized) {
      case "gen":
      case "general":
        return CategoryEnum.GENERAL;
      case "obc":
      case "obc_nc":
      case "obc_ncl":
        return CategoryEnum.OBC;
      case "sc":
        return CategoryEnum.SC;
      case "st":
        return CategoryEnum.ST;
      case "ews":
        return CategoryEnum.EWS;
      case "gen_pwd":
      case "general_pwd":
        return CategoryEnum.GENERAL_PWD;
      case "obc_pwd":
        return CategoryEnum.OBC_PWD;
      case "sc_pwd":
        return CategoryEnum.SC_PWD;
      case "st_pwd":
        return CategoryEnum.ST_PWD;
      case "ews_pwd":
        return CategoryEnum.EWS_PWD;
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
    if (!department) return undefined;

    // Convert to lowercase and swap '&' for 'and' before stripping
    const sanitizedInput = department.toLowerCase().replace(/&/g, "and");
    const normalized = sanitizedInput.replace(/[^a-z0-9]/g, "");

    const entries = Object.entries(DepartmentEnum) as [string, DepartmentEnum][];

    return entries.find(([key, value]) => {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]/g, "");

      return normalized === normalizedKey || normalized === normalizedValue;
    })?.[1];
  }

  private inferCourse(row: IPPORow): CourseEnum {
    // Infer Course of PhD, MTech, MS, MSC, BTech students from their mail
    const email = this.normalizeEmail(row.officialEmail) || "";

    if (/^msc\d+@/i.test(email)) {
      return CourseEnum.MSC;
    }

    if (/^ms\d+@/i.test(email)) {
      return CourseEnum.MS;
    }

    if (/^mt\d+@/i.test(email)) {
      return CourseEnum.MTECH;
    }

    if (/^phd\d+@/i.test(email)) {
      return CourseEnum.PHD;
    }

    // If they aren't MSc, MS, MTech, or PhD, default to BTech
    return CourseEnum.BTECH;
  }

  private parseCSV(filePath: string): IPPORow[] {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });

    // CSV order: S NO, Name, Official Email, Department, ...
    return rawRows
      .slice(1)
      .filter((row) => Array.isArray(row) && row.some((cell) => String(cell ?? "").trim() !== ""))
      .map(
        (row): IPPORow => ({
          sNo: String(row[0] ?? ""),
          name: String(row[1] ?? "").trim(),
          officialEmail: String(row[2] ?? "").trim(),
          department: String(row[3] ?? "").trim(),
          gender: String(row[4] ?? "").trim(),
          dateOfBirth: String(row[5] ?? "").trim(),
          personalEmail: String(row[6] ?? "").trim(),
          category: String(row[7] ?? "").trim(),
          contactNo: String(row[8] ?? "").trim(),
          internshipCompany: String(row[9] ?? "").trim(),
          stipendPerMonth: this.parseNumber(row[10]) ?? 0,
          internOthers: this.parseNumber(row[11]),
          ppoCtc: this.parseCtcRupees(row[12]),
          ppoOfferDate: this.parseDate(row[13]),
          finalCompany: String(row[14] ?? "").trim(),
          finalRole: String(row[15] ?? "").trim(),
          finalFirstYearCtc: this.parseCtcRupees(row[16]),
          finalOverallCtc: this.parseCtcRupees(row[17]),
        })
      );
  }

  private validateRequiredColumns(row: IPPORow): void {
    const missingColumns = REQUIRED_PPO_COLUMNS.filter(({ field }) => {
      const value = row[field];

      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missingColumns.length === 0) return;

    throw new Error(
      `missing required PPO column(s): ${missingColumns
        .map(({ column, header }) => `${column} (${header})`)
        .join(", ")}`
    );
  }

  private async findProgramForStudent(
    row: IPPORow,
    programYear: string,
    transaction?: Transaction
  ): Promise<ProgramModel> {
    const department = this.parseDepartment(row.department);
    if (!department) {
      throw new Error(`cannot create student: invalid department "${row.department}"`);
    }

    const course = this.inferCourse(row);

    const program = await this.programRepo.findOne({
      where: { department, course, year: programYear },
      transaction,
    });
    if (program) return program;

    throw new Error(
      `no program found for department "${department}", course "${course}", and program year "${programYear}"; input valid program year or create program`
    );
  }

  private async findOrCreateStudent(
    row: IPPORow,
    programYear: string,
    transaction?: Transaction
  ): Promise<StudentModel> {
    const rollNo = this.parseRollNo(row.officialEmail);
    if (!rollNo) {
      throw new Error(`missing roll number for "${row.name || row.officialEmail}"`);
    }

    const studentByRollNo = await this.studentRepo.findOne({
      where: { rollNo },
      include: [{ model: UserModel, as: "user" }],
      transaction,
    });
    if (studentByRollNo) return studentByRollNo;

    const email = this.normalizeEmail(row.officialEmail) || `${rollNo}@ppo-import.local`;
    const program = await this.findProgramForStudent(row, programYear, transaction);

    const [user] = await this.userRepo.findOrCreate({
      where: { email, role: RoleEnum.STUDENT },
      defaults: {
        name: row.name || rollNo,
        email,
        contact: row.contactNo || "0000000000",
        role: RoleEnum.STUDENT,
      },
      transaction,
    });

    const student = await this.studentRepo.create(
      {
        userId: user.id,
        programId: program.id,
        rollNo,
        category: this.parseCategory(row.category),
        gender: this.parseGender(row.gender),
        cpi: 0,
      },
      { transaction }
    );

    this.addReport("created", rollNo, "Created missing student profile");

    return student;
  }

  private async findInternOffer(
    studentId: string,
    internSeasonId: string,
    transaction?: Transaction
  ): Promise<OnCampusOfferModel | null> {
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
      transaction,
    });
  }

  private async findPlacementOffer(
    studentId: string,
    placementSeasonId: string,
    transaction?: Transaction
  ): Promise<OnCampusOfferModel | null> {
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
      transaction,
    });
  }

  private async findOrCreateCompany(companyName: string, transaction?: Transaction): Promise<CompanyModel> {
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
      transaction,
    });

    return company;
  }

  private async createRecruiter(company: CompanyModel, transaction?: Transaction): Promise<RecruiterModel> {
    const existingRecruiter = await this.recruiterRepo.findOne({
      where: { companyId: company.id },
      transaction,
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
      transaction,
    });

    return this.recruiterRepo.create(
      {
        userId: user.id,
        companyId: company.id,
        designation: "Placement Coordinator",
      },
      { transaction, hooks: false }
    );
  }

  private async createPPOJob(
    company: CompanyModel,
    recruiter: RecruiterModel,
    seasonId: string,
    role: string,
    transaction?: Transaction
  ): Promise<JobModel> {
    return this.jobRepo.create(
      {
        seasonId,
        companyId: company.id,
        recruiterId: recruiter.id,
        role: role || "Not Specified",
        location: "India",
        active: false,
        currentStatus: JobStatusTypeEnum.RECRUITMENT_PROCESS_COMPLELETED,
        registration: JobRegistrationEnum.CLOSED,
      },
      { transaction, hooks: false }
    );
  }

  private async findJobForCompanyRoleSeason(
    companyName: string,
    role: string,
    seasonId: string,
    transaction?: Transaction
  ): Promise<JobModel | null> {
    return this.jobRepo.findOne({
      where: { seasonId, role: role || "Not Specified" },
      include: [
        {
          model: CompanyModel,
          as: "company",
          required: true,
          where: { name: companyName.trim() },
        },
      ],
      transaction,
    });
  }

  private async findOrCreateJobForCompanyRoleSeason(
    companyName: string,
    role: string,
    seasonId: string,
    transaction?: Transaction
  ): Promise<JobModel> {
    const existingJob = await this.findJobForCompanyRoleSeason(companyName, role, seasonId, transaction);
    if (existingJob) return existingJob;

    const company = await this.findOrCreateCompany(companyName, transaction);
    const recruiter = await this.createRecruiter(company, transaction);

    return this.createPPOJob(company, recruiter, seasonId, role, transaction);
  }

  private async findSalaryForCompanyRoleSeason(
    companyName: string,
    role: string,
    seasonId: string,
    transaction?: Transaction
  ): Promise<SalaryModel | null> {
    return this.salaryRepo.findOne({
      include: [
        {
          model: JobModel,
          as: "job",
          required: true,
          where: { seasonId, role: role || "Not Specified" },
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
      transaction,
    });
  }

  private async createSalary(
    job: JobModel,
    row: IPPORow,
    student: StudentModel,
    transaction?: Transaction
  ): Promise<SalaryModel> {
    const totalCtc = row.finalOverallCtc ?? row.finalFirstYearCtc ?? 0;
    const firstYearCtc = row.finalFirstYearCtc ?? row.finalOverallCtc ?? 0;

    return this.salaryRepo.create(
      {
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
      },
      { transaction }
    );
  }

  private async findOrCreatePlacementSalary(
    row: IPPORow,
    placementSeasonId: string,
    student: StudentModel,
    transaction?: Transaction
  ): Promise<SalaryModel> {
    const existingSalary = await this.findSalaryForCompanyRoleSeason(
      row.finalCompany,
      row.finalRole,
      placementSeasonId,
      transaction
    );
    if (existingSalary) return existingSalary;

    const job = await this.findOrCreateJobForCompanyRoleSeason(
      row.finalCompany,
      row.finalRole,
      placementSeasonId,
      transaction
    );
    const salary = await this.createSalary(job, row, student, transaction);

    this.addReport(
      "created",
      this.parseRollNo(row.officialEmail) ?? row.officialEmail,
      `Created placement job/salary: ${row.finalCompany} - ${row.finalRole || "Not Specified"}`
    );

    return salary;
  }

  private async createInternSalary(
    job: JobModel,
    row: IPPORow,
    student: StudentModel,
    transaction?: Transaction
  ): Promise<SalaryModel> {
    return this.salaryRepo.create(
      {
        jobId: job.id,
        stipend: row.stipendPerMonth,
        tentativeCTC: row.ppoCtc,
        ppoProvisionOnPerformance: true,
        salaryPeriod: "PER_MONTH",
        others: row.internOthers?.toString(),
        programs: [student.programId],
        genders: [this.parseGender(row.gender)],
        categories: [this.parseCategory(row.category)],
        departments: this.parseDepartment(row.department) ? [this.parseDepartment(row.department)!] : undefined,
      },
      { transaction }
    );
  }

  private async findOrCreateInternSalary(
    row: IPPORow,
    internSeasonId: string,
    student: StudentModel,
    transaction?: Transaction
  ): Promise<SalaryModel> {
    const role = row.finalRole || "Intern";
    const existingSalary = await this.findSalaryForCompanyRoleSeason(
      row.internshipCompany,
      role,
      internSeasonId,
      transaction
    );
    if (existingSalary) return existingSalary;

    const job = await this.findOrCreateJobForCompanyRoleSeason(
      row.internshipCompany,
      role,
      internSeasonId,
      transaction
    );
    const salary = await this.createInternSalary(job, row, student, transaction);

    this.addReport(
      "created",
      this.parseRollNo(row.officialEmail) ?? row.officialEmail,
      `Created intern job/salary: ${row.internshipCompany} - ${role}`
    );

    return salary;
  }

  private buildOfferMetadata(row: IPPORow): string {
    return JSON.stringify({
      ppoFromCompany: row.internshipCompany,
      ppoOfferDate: row.ppoOfferDate,
      ppoCtc: row.ppoCtc,
      internStipend: row.stipendPerMonth,
      internOthers: row.internOthers,
      source: "PPO_SYNC_IMPORT",
      importDate: new Date().toISOString(),
    });
  }

  private async createOnCampusOffer(
    student: StudentModel,
    salary: SalaryModel,
    row: IPPORow,
    transaction?: Transaction
  ): Promise<OnCampusOfferModel> {
    return this.onCampusOfferRepo.create(
      {
        studentId: student.id,
        salaryId: salary.id,
        status: OfferStatusEnum.PLACEMENT_PPO,
        metadata: this.buildOfferMetadata(row),
      },
      { transaction }
    );
  }

  private async findOrCreateAcceptedInternOffer(
    row: IPPORow,
    student: StudentModel,
    internSeasonId: string,
    rollNo: string,
    transaction?: Transaction
  ): Promise<OnCampusOfferModel> {
    const internOffer = await this.findInternOffer(student.id, internSeasonId, transaction);

    if (internOffer) {
      if (internOffer.status !== OfferStatusEnum.PPO_ACCEPTED) {
        await internOffer.update({ status: OfferStatusEnum.PPO_ACCEPTED }, { transaction });
      }

      return internOffer;
    }

    const internSalary = await this.findOrCreateInternSalary(row, internSeasonId, student, transaction);
    const createdOffer = await this.onCampusOfferRepo.create(
      {
        studentId: student.id,
        salaryId: internSalary.id,
        status: OfferStatusEnum.PPO_ACCEPTED,
        metadata: this.buildOfferMetadata(row),
      },
      { transaction }
    );

    this.addReport("created", rollNo, "Created missing intern PPO_ACCEPTED offer");

    return createdOffer;
  }

  /*
   * Returns "success" | "skipped". Throws for error conditions so the
   * caller's try/catch counts them as failures.
   */
  private async processRow(
    row: IPPORow,
    internSeasonId: string,
    placementSeason: SeasonModel,
    programYear: string,
    transaction?: Transaction
  ): Promise<"success" | "skipped"> {
    this.validateRequiredColumns(row);

    const rollNo = this.parseRollNo(row.officialEmail);
    if (!rollNo) {
      this.addReport("skipped", row.officialEmail || row.name, "Missing roll number");

      return "skipped";
    }

    // Step 1: find or create the student/profile data needed by the offer flow.
    const student = await this.findOrCreateStudent(row, programYear, transaction);

    /*
     * Step 2: duplicate protection. Any existing placement-season offer means
     * this row has already been handled or conflicts with existing placement data.
     */
    const existingPlacement = await this.findPlacementOffer(student.id, placementSeason.id, transaction);
    if (existingPlacement) {
      this.addReport("skipped", rollNo, `Placement offer already exists with status ${existingPlacement.status}`);

      return "skipped";
    }

    // Step 3: ensure the intern offer exists and is marked as PPO_ACCEPTED.
    await this.findOrCreateAcceptedInternOffer(row, student, internSeasonId, rollNo, transaction);

    /*
     * Step 4: reuse placement salary if present; otherwise create company,
     * recruiter, job, and salary from this PPO row.
     */
    const salary = await this.findOrCreatePlacementSalary(row, placementSeason.id, student, transaction);

    // Step 5: create the placement PPO offer.
    await this.createOnCampusOffer(student, salary, row, transaction);

    this.addReport("success", rollNo, "Placement PPO offer created");

    return "success";
  }

  async syncPPOData(
    internSeasonId: string,
    placementSeasonId: string,
    programYear: string,
    filePath: string
  ): Promise<void> {
    this.report = [];

    this.printHeader("PPO Sync", [
      ["Intern season", internSeasonId],
      ["Placement season", placementSeasonId],
      ["Program year", programYear],
      ["File", filePath],
    ]);

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
    console.log(`Parsed rows        : ${rows.length}`);

    const stats: IUploadStats = { total: rows.length, success: 0, skipped: 0, failed: 0 };

    for (const row of rows) {
      const rollNo = this.parseRollNo(row.officialEmail) ?? row.officialEmail;
      try {
        const result = await this.studentRepo.sequelize.transaction((transaction) =>
          this.processRow(row, internSeason.id, placementSeason, programYear, transaction)
        );
        if (result === "success") {
          stats.success++;
        } else {
          stats.skipped++;
        }
      } catch (err) {
        this.addReport("failed", rollNo, this.getErrorMessage(err));
        stats.failed++;
      }
    }

    this.printFinalReport(stats);
  }
}
