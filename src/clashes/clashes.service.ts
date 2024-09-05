import { Inject, Injectable } from "@nestjs/common";
import { APPLICATION_DAO, EVENT_DAO, JOB_DAO } from "src/constants";
import {
  ApplicationModel,
  CompanyModel,
  EventModel,
  JobModel,
  ProgramModel,
  SeasonModel,
  StudentModel,
  UserModel,
} from "src/db/models";
import { Op, literal } from "sequelize";

@Injectable()
export class ClashesService {
  constructor(
    @Inject(APPLICATION_DAO) private applicationRepo: typeof ApplicationModel,
    @Inject(JOB_DAO) private jobRepo: typeof JobModel,
    @Inject(EVENT_DAO) private eventRepo: typeof EventModel
  ) {}

  async getclashes(jobId: string) {
    const latestRoundSubQuery = literal(
      `"roundNumber" in (SELECT MAX("roundNumber") FROM "Event" e WHERE e."jobId" = "ApplicationModel"."jobId" GROUP BY e."jobId")`
    );

    const applicationPr = this.applicationRepo.findAll({
      include: [
        {
          model: EventModel,
          attributes: ["roundNumber", "type", "id"],
          where: latestRoundSubQuery,
          required: true,
        },
        {
          model: StudentModel,
          attributes: ["rollNo", "gender", "cpi", "id"],
          include: [
            {
              model: ProgramModel,
              attributes: ["course", "branch", "department", "year", "id"],
            },
            {
              model: UserModel,
              attributes: ["name", "email", "contact", "id"],
            },
          ],
        },
        {
          model: JobModel,
          attributes: ["role", "id"],
          include: [
            {
              model: SeasonModel,
              attributes: ["year", "type", "id"],
            },
            {
              model: CompanyModel,
              attributes: ["name", "id"],
            },
          ],
          where: {
            id: {
              [Op.ne]: jobId,
            },
          },
          required: true,
        },
      ],
    });

    const applicationjobPr = this.applicationRepo.findAll({
      include: [
        {
          model: EventModel,
          where: latestRoundSubQuery,
          required: true,
          attributes: ["roundNumber", "type"],
        },
        {
          model: StudentModel,
          attributes: ["rollNo"],
        },
      ],
      where: {
        jobId: jobId,
      },
    });

    const [applications, applicationsJob] = await Promise.all([applicationPr, applicationjobPr]);

    const rollNos = new Set(applicationsJob.map((application) => application.student.rollNo));
    const intersects = applications.filter((application) => rollNos.has(application.student.rollNo));

    return intersects.map((applicaion) => applicaion.get({ plain: true }));
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
