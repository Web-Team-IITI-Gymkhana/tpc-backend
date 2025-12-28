import { Inject, Injectable } from "@nestjs/common";
import {
  RECRUITER_FEEDBACK_DAO,
  SEASON_DAO,
  COMPANY_DAO,
  RECRUITER_DAO,
  USER_DAO,
} from "../../constants";
import { GetFeedbackSeasonDto } from "./dtos/get-seasons.dto";
import { GetFeedbackCompanyDto } from "./dtos/get-companies.dto";
import { RecruiterFeedbackItemDto } from "./dtos/get-feedback.dto";

@Injectable()
export class AdminFeedbackService {
  constructor(
    @Inject(RECRUITER_FEEDBACK_DAO)
    private readonly feedbackDao: any,

    @Inject(SEASON_DAO)
    private readonly seasonDao: any,

    @Inject(COMPANY_DAO)
    private readonly companyDao: any,

    @Inject(RECRUITER_DAO)
    private readonly recruiterDao: any,

    @Inject(USER_DAO)
    private readonly userDao: any,
  ) {}

  /* ================= API 1 ================= */

  async getSeasonsWithFeedback(): Promise<GetFeedbackSeasonDto[]> {
    const rows = await this.feedbackDao.findAll({
      attributes: ["seasonId"],
      group: ["seasonId"],
      raw: true,
    });

    const seasonIds = rows.map((r) => r.seasonId);
    if (seasonIds.length === 0) return [];

    return this.seasonDao.findAll({
      where: { id: seasonIds },
      attributes: ["id", "year", "type"],
      order: [["year", "DESC"]],
    });
  }

    /* ================= API 2 ================= */

  async getCompaniesForSeason(seasonId: string): Promise<GetFeedbackCompanyDto[]> {
    const rows = await this.feedbackDao.findAll({
      where: { seasonId },
      attributes: [
        "companyId",
        [this.feedbackDao.sequelize.fn("COUNT", "*"), "feedbackCount"],
      ],
      group: ["companyId"],
      raw: true,
    });

    const companyIds = rows.map((r) => r.companyId);
    const companies = await this.companyDao.findAll({
      where: { id: companyIds },
      attributes: ["id", "name"],
    });

    return rows.map((row) => {
      const company = companies.find((c) => c.id === row.companyId);
      return {
        companyId: row.companyId,
        companyName: company?.name,
        feedbackCount: Number(row.feedbackCount),
      };
    });
  }

    /* ================= API 3 ================= */

  async getFeedbacksForCompany(
    companyId: string,
    seasonId: string,
  ): Promise<RecruiterFeedbackItemDto[]> {
    const feedbacks = await this.feedbackDao.findAll({
      where: { companyId, seasonId },
      include: [
        {
          model: this.recruiterDao,
          include: [{ model: this.userDao }],
        },
      ],
    });

    return feedbacks.map((f) => ({
      id: f.id,
      officialName: f.recruiter.user.name,
      officialEmail: f.recruiter.user.email,
      designation: f.recruiter.designation,
      communicationPromptness: f.communicationPromptness,
      queryHandling: f.queryHandling,
      logisticsArrangement: f.logisticsArrangement,
      recommendations: f.recommendations,
    }));
  }
}
