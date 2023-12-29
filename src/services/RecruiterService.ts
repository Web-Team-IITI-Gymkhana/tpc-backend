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
    const recruiter = await this.recruiterRepo.findAll({ where: { id: recruiterId } });
    await this.recruiterRepo.destroy({ where: { id: recruiterId }, transaction: t });
    return recruiter[0].userId;
  }

  async buildQuery(fieldsToUpdate: object) {
    const attr = await this.recruiterRepo.describe();
    const attributes = Object.keys(attr);
    const values = {};
    for (const attribute of attributes) {
      if (fieldsToUpdate[`${attribute}`]) {
        values[`${attribute}`] = fieldsToUpdate[`${attribute}`];
      }
    }
    return values;
  }

  async updateRecruiter(recruiterId: string, fieldsToUpdate: object, t?: Transaction) {
    const values = await this.buildQuery(fieldsToUpdate);
    const [_, updatedModel] = await this.recruiterRepo.update(values, {
      where: { id: recruiterId },
      returning: true,
      transaction: t,
    });
    return Recruiter.fromModel(updatedModel[0]);
  }
}

export default RecruiterService;
