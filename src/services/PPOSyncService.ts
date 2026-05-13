/* eslint-disable no-console */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as fs from "fs";
import * as XLSX from "xlsx";
import {
  CompanyModel,
  JobModel,
  OnCampusOfferModel,
  SalaryModel,
  StudentModel,
} from "../db/models";
import { OfferStatusEnum } from "../enums";

interface PPORow {
  sNo: string;
  name: string;
  officialEmail: string;
  department: string;
  gender: string;
  dateOfBirth: string;
  personalEmail: string;
  birthCategory: string;
  contactNo: string;
  internshipCompany: string;
  stipendPerMonth: string;
  others: string;
  ppoCTC: string;
  offerReceivedDate: string;
  fteCompanyName: string;
  jobTitle: string;
  firstYearCTC: string;
  overallCTC: string;
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
  ) {}

  private extractRollNo(email: string): string | null {
    const atIndex = email.indexOf("@");
    if (atIndex <= 0) return null;
    return email.substring(0, atIndex).trim().toLowerCase();
  }

  private parseCSV(filePath: string): PPORow[] {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });

    // Skip header row; filter out blank rows
    return rawRows
      .slice(1)
      .filter((row) => Array.isArray(row) && row.length > 2 && row[2])
      .map((row): PPORow => ({
        sNo:               String(row[0]  ?? ""),
        name:              String(row[1]  ?? ""),
        officialEmail:     String(row[2]  ?? "").trim(),
        department:        String(row[3]  ?? ""),
        gender:            String(row[4]  ?? ""),
        dateOfBirth:       String(row[5]  ?? ""),
        personalEmail:     String(row[6]  ?? ""),
        birthCategory:     String(row[7]  ?? ""),
        contactNo:         String(row[8]  ?? ""),
        internshipCompany: String(row[9]  ?? ""),
        stipendPerMonth:   String(row[10] ?? ""),
        others:            String(row[11] ?? ""),
        ppoCTC:            String(row[12] ?? ""),
        offerReceivedDate: String(row[13] ?? ""),
        fteCompanyName:    String(row[14] ?? "").trim(),
        jobTitle:          String(row[15] ?? ""),
        firstYearCTC:      String(row[16] ?? ""),
        overallCTC:        String(row[17] ?? ""),
      }));
  }

  private async findInternOffer(
    studentId: string,
    internSeasonId: string,
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
    });
  }

  private async findPlacementOffer(
    studentId: string,
    placementSeasonId: string,
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
    });
  }

  private async findSalaryForPlacementCompany(
    companyName: string,
    placementSeasonId: string,
  ): Promise<SalaryModel | null> {
    return this.salaryRepo.findOne({
      include: [
        {
          model: JobModel,
          as: "job",
          required: true,
          where: { seasonId: placementSeasonId },
          include: [
            {
              model: CompanyModel,
              as: "company",
              required: true,
              where: { name: companyName },
            },
          ],
        },
      ],
    });
  }

  // Returns "success" | "skipped". Throws for error conditions so the
  // caller's try/catch counts them as failures.
  private async processRow(
    row: PPORow,
    internSeasonId: string,
    placementSeasonId: string,
  ): Promise<"success" | "skipped"> {
    const rollNo = this.extractRollNo(row.officialEmail);
    if (!rollNo) {
      console.warn(`[PPO Upload] SKIP (unparseable email): ${row.officialEmail}`);
      return "skipped";
    }

    // Step 2: look up student by roll number
    const student = await this.studentRepo.findOne({ where: { rollNo } });
    if (!student) {
      console.warn(`[PPO Upload] SKIP Roll ${rollNo}: student not found in DB`);
      return "skipped";
    }

    // Step 3: find the student's intern-season offer
    const internOffer = await this.findInternOffer(student.id, internSeasonId);
    if (!internOffer) {
      console.warn(
        `[PPO Upload] SKIP Roll ${rollNo}: no intern offer found in season ${internSeasonId}`,
      );
      return "skipped";
    }

    // Step 4: mark intern offer as PPO_ACCEPTED (idempotent)
    if (internOffer.status !== OfferStatusEnum.PPO_ACCEPTED) {
      await internOffer.update({ status: OfferStatusEnum.PPO_ACCEPTED });
    }

    // Step 5: check for an existing placement-season offer
    const existingPlacement = await this.findPlacementOffer(student.id, placementSeasonId);
    if (existingPlacement) {
      if (existingPlacement.status === OfferStatusEnum.PLACEMENT_PPO) {
        console.log(`[PPO Upload] SKIP Roll ${rollNo}: placement PPO offer already exists`);
      } else {
        console.warn(
          `[PPO Upload] SKIP Roll ${rollNo}: placement offer already exists with status ${existingPlacement.status}`,
        );
      }
      return "skipped";
    }

    // Step 6: find the salary record for this company in the placement season
    const salary = await this.findSalaryForPlacementCompany(
      row.fteCompanyName,
      placementSeasonId,
    );
    if (!salary) {
      throw new Error(
        `no salary/job found for company "${row.fteCompanyName}" in placement season ${placementSeasonId}`,
      );
    }

    // Create the placement PPO offer
    await this.onCampusOfferRepo.create({
      studentId: student.id,
      salaryId: salary.id,
      status: OfferStatusEnum.PLACEMENT_PPO,
    });

    console.log(`[PPO Upload] OK   Roll ${rollNo}: placement PPO offer created`);
    return "success";
  }

  async syncPPOData(
    internSeasonId: string,
    placementSeasonId: string,
    filePath: string,
  ): Promise<void> {
    console.log("=".repeat(60));
    console.log("PPO Sync");
    console.log(`  Intern season    : ${internSeasonId}`);
    console.log(`  Placement season : ${placementSeasonId}`);
    console.log(`  File             : ${filePath}`);
    console.log("=".repeat(60));

    const rows = this.parseCSV(filePath);
    console.log(`Parsed ${rows.length} data rows\n`);

    const stats: UploadStats = { total: rows.length, success: 0, skipped: 0, failed: 0 };

    for (const row of rows) {
      const rollNo = this.extractRollNo(row.officialEmail) ?? row.officialEmail;
      try {
        const result = await this.processRow(row, internSeasonId, placementSeasonId);
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
      `Total: ${stats.total} | Success: ${stats.success} | Skipped: ${stats.skipped} | Failed: ${stats.failed}`,
    );
    console.log("=".repeat(60));
  }
}
