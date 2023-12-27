import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { RECRUITER_DAO } from "src/constants";
import { RecruiterModel } from "src/db/models";
import { Recruiter } from "src/entities/Recruiter";

@Injectable()
class RecruiterService {
  private logger = new Logger(RecruiterService.name);

  constructor(@Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel) {}

  async createRecruiter(recruiter: Recruiter, t?: Transaction) {
    const recruiterModel = await this.recruiterRepo.create(omit(recruiter, "user", "company"), { transaction: t });
    return Recruiter.fromModel(recruiterModel);
  }

  async getRecruiters(where?: WhereOptions<RecruiterModel>, t?: Transaction) {
    const recruiterModels = await this.recruiterRepo.findAll({ where: where, transaction: t });
    return recruiterModels.map((recruiterModel) => Recruiter.fromModel(recruiterModel));
  }

  async deleteRecruiter(recruiterId: string, t?: Transaction) {
    await this.recruiterRepo.destroy({ where: { id: recruiterId }, transaction: t });
  }
}

export default RecruiterService;
