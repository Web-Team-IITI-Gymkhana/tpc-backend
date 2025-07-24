import { Inject, Injectable } from "@nestjs/common";
import { JOB_DAO } from "src/constants";
import { CompanyModel, JobModel, SeasonModel } from "src/db/models";
import { Sequelize } from "sequelize-typescript";
import { QueryTypes } from "sequelize";

@Injectable()
export class ClashesService {
  constructor(
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject("SEQUELIZE") private readonly sequelizeInstance: Sequelize
  ) {}

  async getclashes(jobId: string) {
    const eventQuery = `WITH "pa" AS (
        SELECT 
            "Application"."id" as "aid",
            "Event"."id" as "eventId",
            "Event"."startDateTime" as "startDateTime",
            "Event"."endDateTime" as "endDateTime",
            "Event"."roundNumber" as "roundNumber",
            "Event"."type" as "type",
            "Application"."studentId" as "studentId"
        FROM "Application"
        INNER JOIN "Event" ON "Application"."eventId" = "Event"."id"
        WHERE "Event"."endDateTime" >= NOW()
        AND "Event"."jobId" = '${jobId}'
        AND "Event"."type" != 'POLL'
    ),
    "restEvents" AS (
        SELECT 
            "Application"."id" as "caid",
            "Event"."id" as "ceventId",
            "Event"."startDateTime" as "cstartDateTime",
            "Event"."endDateTime" as "cendDateTime",
            "Event"."roundNumber" as "croundNumber",
            "Event"."type" as "ctype",
            "Application"."studentId" as "cstudentId",
            "Event"."jobId" as "jobId"
        FROM "Application"
        INNER JOIN "Event" ON "Application"."eventId" = "Event"."id"
        WHERE "Event"."endDateTime" >= NOW()
        AND "Event"."jobId" != '${jobId}'
        AND "Event"."type" != 'POLL'
    ),
    "jobs" AS (
        SELECT 
            "Job"."id" as "id",
            "Company"."name" as "name",
            "Job"."role" as "role"
        FROM "Job" 
        INNER JOIN "Company" ON "Job"."companyId" = "Company"."id"
    ),
    "students" AS (
        SELECT 
            "Student"."id" as "sid",
            "Student"."rollNo" as "rollNo",
            "Student"."gender" as "gender",
            "Student"."cpi" as "cpi",
            "User"."name" as "name",
            "User"."email" as "email",
            "User"."contact" as "contact",
            "Program"."course" as "course",
            "Program"."branch" as "branch",
            "Program"."department" as "department",
            "Program"."year" as "year"
            FROM "Student"
            INNER JOIN "Program" ON "Student"."programId" = "Program"."id"
            INNER JOIN "User" on "Student"."userId" = "User"."id"
    )
    SELECT
        "clashEvents"."aid" as "aid",
        "clashEvents"."caid" as "caid",
        "clashEvents"."eventId" as "eventId",
        "clashEvents"."ceventId" as "ceventId",
        "clashEvents"."startDateTime" as "startDateTime",
        "clashEvents"."cstartDateTime" as "cstartDateTime",
        "clashEvents"."endDateTime" as "endDateTime",
        "clashEvents"."cendDateTime" as "cendDateTime",
        "clashEvents"."roundNumber" as "roundNumber",
        "clashEvents"."croundNumber" as "croundNumber",
        "clashEvents"."type" as "type",
        "clashEvents"."ctype" as "ctype",
        "clashEvents"."studentId" as "studentId",
        "clashEvents"."jobId" as "jobId",
        "students"."rollNo" as "rollNo",
        "students"."gender" as "gender",
        "students"."cpi" as "cpi",
        "students"."name" as "name",
        "students"."email" as "email",
        "students"."contact" as "contact",
        "students"."course" as "course",
        "students"."branch" as "branch",
        "students"."department" as "department",
        "students"."year" as "year",
        "jobs"."role" as "role",
        "jobs"."name" as "companyName"
    FROM (
        SELECT * FROM "restEvents"
        INNER JOIN "pa" 
        ON "restEvents"."cstudentId" = "pa"."studentId"
        AND NOT (
            "restEvents"."cstartDateTime" > "pa"."endDateTime" OR
            "restEvents"."cendDateTime" < "pa"."startDateTime"
        )
    ) "clashEvents" 
    INNER JOIN "jobs" ON "clashEvents"."jobId" = "jobs"."id"
    INNER JOIN "students" ON "clashEvents"."studentId" = "students"."sid"`;

    const offCampusQuery = `WITH "pa" AS (
        SELECT 
            "Application"."id" as "aid",
            "Event"."id" as "eventId",
            "Event"."startDateTime" as "startDateTime",
            "Event"."endDateTime" as "endDateTime",
            "Event"."roundNumber" as "roundNumber",
            "Event"."type" as "type",
            "Application"."studentId" as "studentId"
        FROM "Application"
        INNER JOIN "Event" ON "Application"."eventId" = "Event"."id"
        WHERE "Event"."endDateTime" >= NOW()
        AND "Event"."jobId" = '${jobId}'
    ),
    "students" AS (
        SELECT 
            "Student"."id" as "sid",
            "Student"."rollNo" as "rollNo",
            "Student"."gender" as "gender",
            "Student"."cpi" as "cpi",
            "User"."name" as "name",
            "User"."email" as "email",
            "User"."contact" as "contact",
            "Program"."course" as "course",
            "Program"."branch" as "branch",
            "Program"."department" as "department",
            "Program"."year" as "year"
            FROM "Student"
            INNER JOIN "Program" ON "Student"."programId" = "Program"."id"
            INNER JOIN "User" on "Student"."userId" = "User"."id"
    ),
    "offers" AS (
        SELECT 
            "Company"."name" as "name",
            "OffCampusOffer"."studentId" as "studentId",
            "OffCampusOffer"."role" as "role",
            "OffCampusOffer"."status" as "status",
            "OffCampusOffer"."salary" as "salary"
        FROM "OffCampusOffer"
        INNER JOIN "Company" ON "OffCampusOffer"."companyId" = "Company"."id"
        WHERE "OffCampusOffer"."seasonId" IN (
            SELECT "seasonId" FROM "Job" 
            WHERE "id" = '${jobId}'
        )
    )
    SELECT 
        "pa"."aid" as "aid",
        "pa"."eventId" as "eventId",
        "pa"."startDateTime" as "startDateTime",
        "pa"."endDateTime" as "endDateTime",
        "pa"."roundNumber" as "roundNumber",
        "pa"."type" as "type",
        "students"."sid" as "studentId",
        "students"."rollNo" as "rollNo",
        "students"."gender" as "gender",
        "students"."cpi" as "cpi",
        "students"."name" as "name",
        "students"."email" as "email",
        "students"."contact" as "contact",
        "students"."course" as "course",
        "students"."branch" as "branch",
        "students"."department" as "department",
        "students"."year" as "year",
        "offers"."name" as "companyName",
        "offers"."role" as "role",
        "offers"."status" as "status",
        "offers"."salary" as "salary"
    FROM "offers"
    INNER JOIN "pa" ON "pa"."studentId" = "offers"."studentId"
    INNER JOIN "students" ON "students"."sid" = "offers"."studentId"`;

    const onCampusQuery = `WITH "pa" AS (
        SELECT 
            "Application"."id" as "aid",
            "Event"."id" as "eventId",
            "Event"."startDateTime" as "startDateTime",
            "Event"."endDateTime" as "endDateTime",
            "Event"."roundNumber" as "roundNumber",
            "Event"."type" as "type",
            "Application"."studentId" as "studentId"
        FROM "Application"
        INNER JOIN "Event" ON "Application"."eventId" = "Event"."id"
        WHERE "Event"."endDateTime" >= NOW()
        AND "Event"."jobId" = '${jobId}'
    ),
    "students" AS (
        SELECT 
            "Student"."id" as "sid",
            "Student"."rollNo" as "rollNo",
            "Student"."gender" as "gender",
            "Student"."cpi" as "cpi",
            "User"."name" as "name",
            "User"."email" as "email",
            "User"."contact" as "contact",
            "Program"."course" as "course",
            "Program"."branch" as "branch",
            "Program"."department" as "department",
            "Program"."year" as "year"
            FROM "Student"
            INNER JOIN "Program" ON "Student"."programId" = "Program"."id"
            INNER JOIN "User" on "Student"."userId" = "User"."id"
    ),
    "offers" AS (
        SELECT 
            "Company"."name" as "name",
            "Job"."role" as "role",
            "OnCampusOffer"."status" as "status",
            "OnCampusOffer"."studentId" as "studentId",
            "Salary"."baseSalary" as "baseSalary",
            "Salary"."totalCTC" as "totalCTC",
            "Salary"."takeHomeSalary" as "takeHomeSalary",
            "Salary"."grossSalary" as "grossSalary",
            "Salary"."otherCompensations" as "otherCompensations"
        FROM "OnCampusOffer"
        INNER JOIN "Salary" ON "OnCampusOffer"."salaryId" = "Salary"."id"
        INNER JOIN "Job" ON "Salary"."jobId" = "Job"."id"
        INNER JOIN "Company" ON "Job"."companyId" = "Company"."id"
        WHERE "Job"."seasonId" IN (
            SELECT "seasonId" FROM "Job" 
            WHERE "Job"."id" = '${jobId}'
        ) 
    )
    SELECT 
        "pa"."aid" as "aid",
        "pa"."eventId" as "eventId",
        "pa"."startDateTime" as "startDateTime",
        "pa"."endDateTime" as "endDateTime",
        "pa"."roundNumber" as "roundNumber",
        "pa"."type" as "type",
        "students"."sid" as "studentId",
        "students"."gender" as "gender",
        "students"."cpi" as "cpi",
        "students"."name" as "name",
        "students"."email" as "email",
        "students"."contact" as "contact",
        "students"."course" as "course",
        "students"."branch" as "branch",
        "students"."department" as "department",
        "students"."year" as "year",
        "offers"."name" as "companyName",
        "offers"."role" as "role",
        "offers"."status" as "status",
        "offers"."baseSalary" as "baseSalary",
        "offers"."totalCTC" as "totalCTC",
        "offers"."takeHomeSalary" as "takeHomeSalary",
        "offers"."grossSalary" as "grossSalary",
        "offers"."otherCompensations" as "otherCompensations"
    FROM "offers"
    INNER JOIN "pa" ON "pa"."studentId" = "offers"."studentId"
    INNER JOIN "students" ON "students"."sid" = "offers"."studentId"`;

    const [prev, pron, proff] = await Promise.all([
      this.sequelizeInstance.query(eventQuery, { type: QueryTypes.SELECT }),
      this.sequelizeInstance.query(onCampusQuery, { type: QueryTypes.SELECT }),
      this.sequelizeInstance.query(offCampusQuery, { type: QueryTypes.SELECT }),
    ]);

    // Result object
    const clashes = {
      event: prev,
      onCampus: pron,
      offCampus: proff,
    };

    return clashes;
  }

  async getJobs() {
    const jobs = await this.jobRepo.findAll({
      attributes: ["role", "id"],
      include: [
        {
          model: CompanyModel,
          attributes: ["name", "id"],
        },
        {
          model: SeasonModel,
          attributes: ["year", "type", "id"],
        },
      ],
    });

    return jobs.map((job) => job.get({ plain: true }));
  }
}
