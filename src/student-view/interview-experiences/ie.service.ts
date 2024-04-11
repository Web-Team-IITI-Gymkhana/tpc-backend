import { Injectable, Inject } from "@nestjs/common";
import { FindOptions, Transaction } from "sequelize";
import { INTERVIEW_EXPERIENCE_DAO, USER_DAO } from "src/constants";
import { CompanyModel, UserModel } from "src/db/models";
import { InterviewExperienceModel } from "src/db/models/InterviewExperienceModel";
import { parsePagesize, parseFilter, parseOrder } from "src/utils";

@Injectable()
export class InterviewExperienceService {
  constructor(
    @Inject(INTERVIEW_EXPERIENCE_DAO) private iexpRepo: typeof InterviewExperienceModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
  ) {}

  async getInterviewExperiences(where) {
    const findOptions: FindOptions<InterviewExperienceModel> = {
      include: [
        {
          model: CompanyModel,
          as: "company",
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);

    parseFilter(findOptions, where.filterBy || {});

    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.iexpRepo.findAll(findOptions);

    return ans.map((ie) => ie.get({ plain: true }));
  }

  async getInterviewExperience(id: string) {
    const ans = await this.iexpRepo.findByPk(id);

    return ans.filename;
  }

  async createInterviewExperience(body, studentId, userId, t: Transaction) {
    const res = await this.userRepo.findByPk(userId);
    const ans = await this.iexpRepo.create(
      { ...body, studentId: studentId, studentName: res.name },
      { transaction: t }
    );

    return ans.id;
  }

  async deleteInterviewExperience(filename: string, studentId: string, t: Transaction) {
    const ans = await this.iexpRepo.destroy({ where: { filename: filename, studentId: studentId }, transaction: t });

    return ans;
  }
}
