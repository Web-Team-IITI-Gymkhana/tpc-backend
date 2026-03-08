import { Inject, Injectable } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import {
  RECRUITER_FEEDBACK_DAO,
} from "src/constants";
import {
  CompanyModel,
  RecruiterModel,
  SeasonModel,
  UserModel,
} from "src/db/models";
import { FeedbackQueryDto } from "./dtos/query.dto";

@Injectable()
export class AdminFeedbackService {
  constructor(
    @Inject(RECRUITER_FEEDBACK_DAO)
    private readonly feedbackRepo: any,
  ) {}

  // get all feedbacks
  async getAllFeedbacks(query: FeedbackQueryDto) {
    const findOptions: FindOptions = {
      attributes: ["id", "createdAt"],

      include: [
        {
          model: RecruiterModel,
          as: "recruiter",
          required: true,
          attributes: ["designation"],
          include: [
            {
              model: UserModel,
              as: "user",
              attributes: ["name", "email"],
            },
          ],
        },
        {
          model: CompanyModel,
          as: "company",
          attributes: ["name"],
        },
        {
          model: SeasonModel,
          as: "season",
          attributes: ["year", "type"],
        },
      ],
    };

    /* pagination */
    Object.assign(findOptions, parsePagesize(query));

    /* filtering */
    parseFilter(findOptions, query.filterBy || {});

    /* ordering */
    findOptions.order = parseOrder(query.orderBy || { createdAt: "DESC" });

    const rows = await this.feedbackRepo.findAll(findOptions);

    /* flatten for frontend table */
    return rows.map((fb) => ({
      id: fb.id,
      recruiterName: fb.recruiter.user.name,
      recruiterEmail: fb.recruiter.user.email,
      recruiterDesignation: fb.recruiter.designation,
      companyName: fb.company.name,
      seasonYear: fb.season.year,
      seasonType: fb.season.type,
      createdAt: fb.createdAt,
    }));
  }

  // get one feedback
  async getFeedbackById(id: string) {
    const fb = await this.feedbackRepo.findByPk(id, {
      include: [
        {
          model: RecruiterModel,
          as: "recruiter",
          include: [{ model: UserModel, as: "user" }],
        },
        { model: CompanyModel, as: "company" },
        { model: SeasonModel, as: "season" },
      ],
    });

    if (!fb) return null;

    return fb.get({ plain: true });
  }
}
