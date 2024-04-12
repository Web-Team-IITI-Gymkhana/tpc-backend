import { Inject, Injectable } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { PENALTY_DAO } from "src/constants";
import { PenaltyModel, StudentModel, UserModel } from "src/db/models";
import { parsePagesize, parseFilter, parseOrder } from "src/utils";

@Injectable()
export class PenaltyService {
  constructor(@Inject(PENALTY_DAO) private penaltyRepo: typeof PenaltyModel) {}

  async getPenalties(where) {
    const findOptions: FindOptions<PenaltyModel> = {
      include: [
        {
          model: StudentModel,
          as: "student",
          required: true,
          include: [
            {
              model: UserModel,
              as: "user",
            },
          ],
        },
      ],
    };

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);

    parseFilter(findOptions, where.filterBy || {});

    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.penaltyRepo.findAll(findOptions);

    return ans.map((penalty) => penalty.get({ plain: true }));
  }

  async createPenalties(penalties) {
    const ans = await this.penaltyRepo.bulkCreate(penalties);

    return ans.map((penalty) => penalty.id);
  }

  async deletePenalties(ids: string[]) {
    const ans = await this.penaltyRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
