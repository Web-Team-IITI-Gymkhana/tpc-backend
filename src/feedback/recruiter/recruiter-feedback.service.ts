import {
  Inject,
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { Op } from "sequelize";
import { CreateRecruiterFeedbackDto } from "./dtos/post.dto";
import { RecruiterFeedbackSeasonDto } from "./dtos/get.dto";

import {
  RECRUITER_FEEDBACK_DAO,
  RECRUITER_DAO,
  USER_DAO,
  COMPANY_DAO,
  SEASON_DAO,
  JOB_DAO,
} from "../../constants";

import { EmailService, getHtmlContent } from "../../services/EmailService";
import path from "path";

@Injectable()
export class RecruiterFeedbackService {
  constructor(
    @Inject(RECRUITER_FEEDBACK_DAO)
    private readonly feedbackDao: any,

    @Inject(RECRUITER_DAO)
    private readonly recruiterDao: any,

    @Inject(USER_DAO)
    private readonly userDao: any,

    @Inject(COMPANY_DAO)
    private readonly companyDao: any,

    @Inject(SEASON_DAO)
    private readonly seasonDao: any,

    @Inject(JOB_DAO)
    private readonly jobDao: any,

    private readonly emailService: EmailService,
  ) {}

  // ======================================================
  // POST: Submit Recruiter Feedback (UNCHANGED LOGIC)
  // ======================================================
  async submitFeedback(body: CreateRecruiterFeedbackDto, userId: string) {
    const recruiter = await this.recruiterDao.findOne({
      where: { userId },
      include: ["user"],
    });

    if (!recruiter) {
      throw new ForbiddenException("Only recruiters can submit feedback");
    }

    // BEFORE creating feedback
    const existingFeedback = await this.feedbackDao.findOne({
      where: {
        recruiterId: recruiter.id,
        seasonId: body.seasonId,
      },
    });

    if (existingFeedback) {
      throw new ForbiddenException(
        "Feedback already submitted for this season"
      );
    }

    const company = await this.companyDao.findByPk(recruiter.companyId);
    const season = await this.seasonDao.findByPk(body.seasonId);

    const feedback = await this.feedbackDao.create({
      recruiterId: recruiter.id,
      companyId: recruiter.companyId,
      seasonId: body.seasonId,

      communicationPromptness: body.communicationPromptness,
      queryHandling: body.queryHandling,
      logisticsArrangement: body.logisticsArrangement,
      studentFamiliarity: body.studentFamiliarity,
      studentCommunication: body.studentCommunication,
      resumeQuality: body.resumeQuality,
      studentPreparedness: body.studentPreparedness,
      disciplineAndPunctuality: body.disciplineAndPunctuality,

      rightTimeToContact: body.rightTimeToContact,
      recommendations: body.recommendations,
    });

    // ---------- Admin Email (non-blocking) ----------
    try {
      const admins = await this.userDao.findAll({
        where: { role: "ADMIN" },
        attributes: ["email"],
      });

      const recepients = admins.map(a => ({ address: a.email }));

      const templatePath = path.resolve(
        process.cwd(),
        "src/html",
        "RecruiterFeedbackToAdmin.html"
      );

      const html = getHtmlContent(templatePath, {
        companyName: company?.name ?? "Company",
        season: `${season?.year} ${season?.type}`,
        officialName: recruiter.user?.name,
        designation: recruiter.designation,
        officialEmail: recruiter.user?.email,
        url: `${process.env.FRONTEND_URL}/admin/feedback/${body.seasonId}/${company.id}`,
      });

      await this.emailService.sendEmail({
        recepients,
        subject: `Recruiter Feedback Submitted by ${company?.name}`,
        html,
      });
    } catch (err) {
      console.error("Feedback email failed:", err.message);
    }

    return feedback;
  }

  // ======================================================
  // GET: Seasons Eligible for Recruiter Feedback
  // ======================================================
  async getRecruiterFeedbackSeasons(
    userId: string
  ): Promise<RecruiterFeedbackSeasonDto[]> {
    const recruiter = await this.recruiterDao.findOne({
      where: { userId },
    });

    if (!recruiter) {
      throw new ForbiddenException("Only recruiters can view feedback seasons");
    }

    // Jobs → seasons
    const jobs = await this.jobDao.findAll({
      where: { companyId: recruiter.companyId },
      attributes: ["seasonId"],
    });

    const seasonIds = [
      ...new Set(jobs.map(j => j.seasonId).filter(Boolean)),
    ];

    if (seasonIds.length === 0) {
      return [];
    }

    // Fetch seasons
    const seasons = await this.seasonDao.findAll({
      where: { id: { [Op.in]: seasonIds } },
      order: [["year", "DESC"]],
    });

    // Fetch submitted feedbacks
    const feedbacks = await this.feedbackDao.findAll({
      where: { recruiterId: recruiter.id },
      attributes: ["seasonId"],
    });

    const submittedSeasonIds = new Set(
      feedbacks.map(f => f.seasonId)
    );

    return seasons.map(season => ({
      id: season.id,
      year: season.year,
      type: season.type,
      status: season.status,
      feedbackSubmitted: submittedSeasonIds.has(season.id),
    }));
  }
}
