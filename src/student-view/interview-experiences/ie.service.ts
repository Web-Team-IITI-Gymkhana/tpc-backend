import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EVENT_DAO, INTERVIEW_EXPERIENCE_DAO, USER_DAO } from "src/constants";
import { InterviewExperienceModel } from "src/db/models/InterviewExperienceModel";
import { InterviewExperienceQueryDto } from "./dtos/query.dto";
import { ApplicationModel, CompanyModel, EventModel, JobModel, SeasonModel, UserModel } from "src/db/models";
import { FindOptions, Op, Transaction } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CreateIEDto } from "./dtos/post.dto";
import { IUser } from "src/auth/User";

@Injectable()
export class InterviewExperienceService {
  constructor(
    @Inject(INTERVIEW_EXPERIENCE_DAO) private ieRepo: typeof InterviewExperienceModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel,
    @Inject(EVENT_DAO) private eventRepo: typeof EventModel
  ) {}

  async getInterviewExperiences(where: InterviewExperienceQueryDto) {
    const findOptions: FindOptions<InterviewExperienceModel> = {
      include: [
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: SeasonModel,
          as: "season",
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.ieRepo.findAll(findOptions);

    return ans.map((ie) => ie.get({ plain: true }));
  }

  async createInterviewExperience(ie: CreateIEDto, userId: string, t: Transaction) {
    const [ans, res] = await Promise.all([
      this.userRepo.findByPk(userId),
      this.eventRepo.findOne({
        where: { roundNumber: { [Op.gt]: 0 } },
        include: [
          {
            model: ApplicationModel,
            as: "applications",
            where: { studentId: ie.studentId },
          },
          {
            model: JobModel,
            as: "job",
            where: { companyId: ie.companyId, seasonId: ie.seasonId },
          },
        ],
      }),
    ]);

    if (!ans || !res) throw new ForbiddenException("You are not allowed to do this operation");
    ie.studentName = ans.name;

    const result = await this.ieRepo.create(ie, { transaction: t });

    return result.id;
  }

  async deleteInterviewExperience(filename: string, studentId: string, t: Transaction) {
    const ans = await this.ieRepo.destroy({ where: { filename, studentId }, transaction: t });
    if (ans === 0) throw new NotFoundException("No such file found");

    return ans;
  }
}
