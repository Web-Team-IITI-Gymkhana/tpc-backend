import { Inject, Injectable, Logger } from "@nestjs/common";
import { includes, omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { RECRUITER_DAO } from "src/constants";
import { RecruiterModel, UserModel } from "src/db/models";
import { Recruiter } from "src/entities/Recruiter";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class RecruiterService {
  private logger = new Logger(RecruiterService.name);

  constructor(@Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel) { }

  async createRecruiter(recruiter: Recruiter, t?: Transaction) {
    const recruiterModel = await this.recruiterRepo.create(omit(recruiter, "user", "company"), { transaction: t });
    return Recruiter.fromModel(recruiterModel);
  }
  async getOrCreateRecruiter(recruiter: Recruiter, t?: Transaction) {
    const [recruiterModel] = await this.recruiterRepo.findOrCreate({
      where: omit(recruiter, "user", "company"),
      defaults: omit(recruiter, "user", "company"),
      transaction: t,
    });
    return Recruiter.fromModel(recruiterModel);
  }

  async getRecruiters(where?: WhereOptions<RecruiterModel>, t?: Transaction) {
    const values = getQueryValues(where);
    const recruiterModels = await this.recruiterRepo.findAll({ where: values, transaction: t, include: { model: UserModel, required: true } });
    return recruiterModels.map((recruiterModel) => Recruiter.fromModel(recruiterModel));
  }

  async deleteRecruiter(recruiterId: string, t?: Transaction) {
    return !!(await this.recruiterRepo.destroy({ where: { id: recruiterId }, transaction: t }));
  }

  async updateRecruiter(recruiterId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.recruiterRepo.update(fieldsToUpdate, {
      where: { id: recruiterId },
      returning: true,
      transaction: t,
    });
    return Recruiter.fromModel(updatedModel[0]);
  }
}

export default RecruiterService;
