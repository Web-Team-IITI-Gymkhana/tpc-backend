import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction, WhereOptions } from "sequelize";
import { PENALTY_DAO } from "src/constants";
import { PenaltyModel } from "src/db/models";
import { Penalty } from "src/entities/Penalty";

@Injectable()
class PenaltyService {
  private logger = new Logger(PenaltyService.name);

  constructor(@Inject(PENALTY_DAO) private penaltyRepo: typeof PenaltyModel) {}

  async createPenalty(penalty: Penalty, t?: Transaction) {
    const penaltyModel = await this.penaltyRepo.create(penalty, { transaction: t });
    return Penalty.fromModel(penaltyModel);
  }

  async getPenalties(where: WhereOptions<PenaltyModel>, t?: Transaction) {
    const penaltymodels = await this.penaltyRepo.findAll({ where: where, transaction: t });
    return penaltymodels.map((penaltyModel) => Penalty.fromModel(penaltyModel));
  }

  async updatePenalty(penaltyId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.penaltyRepo.update(fieldsToUpdate, {
      where: { id: penaltyId },
      returning: true,
      transaction: t,
    });
    return Penalty.fromModel(updatedModel[0]);
  }

  async deletePenalty(penaltyId: string, t?: Transaction) {
    return !!(await this.penaltyRepo.destroy({ where: { id: penaltyId }, transaction: t }));
  }
}

export default PenaltyService;
