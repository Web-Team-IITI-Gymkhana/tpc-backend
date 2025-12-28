import { Inject, Injectable, ForbiddenException } from "@nestjs/common";
import { CreateRecruiterFeedbackDto } from "./dtos/create-recruiter-feedback.dto";
import {
  RECRUITER_FEEDBACK_DAO,
  RECRUITER_DAO,
  USER_DAO,
  COMPANY_DAO,
  SEASON_DAO,
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

    private readonly emailService: EmailService,
  ) {}

  async submitFeedback(body: CreateRecruiterFeedbackDto, userId: string) {
    /* Find recruiter + linked user */
    const recruiter = await this.recruiterDao.findOne({
      where: { userId },
      include: ["user"],
    });

    if (!recruiter) {
      throw new ForbiddenException("Only recruiters can submit feedback");
    }

    /* Fetch company */
    const company = await this.companyDao.findByPk(recruiter.companyId);

    /* Fetch season */
    const season = await this.seasonDao.findByPk(body.seasonId);

    /* Create feedback */
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

    /* Send admin email (non-blocking) */
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
}
