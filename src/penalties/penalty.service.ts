import { Inject, Injectable } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { PENALTY_DAO } from "src/constants";
import { PenaltyModel, ProgramModel, StudentModel, UserModel } from "src/db/models";
import { parsePagesize, parseFilter, parseOrder } from "src/utils";
import { PenaltyQueryDto } from "./dtos/query.dto";
import { CreatePenaltiesDto } from "./dtos/post.dto";
import { UpdatePenaltiesDto } from "./dtos/patch.dto";

@Injectable()
export class PenaltyService {
  constructor(@Inject(PENALTY_DAO) private penaltyRepo: typeof PenaltyModel) {}

  async getPenalties(where: PenaltyQueryDto) {
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
            {
              model: ProgramModel,
              as: "program",
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

  async createPenalties(penalties: CreatePenaltiesDto[]) {
    const ans = await this.penaltyRepo.bulkCreate(penalties);

    return ans.map((penalty) => penalty.id);
  }

  async updatePenalty(penalty: UpdatePenaltiesDto) {
    const [ans] = await this.penaltyRepo.update(penalty, { where: { id: penalty.id } });

    return ans > 0 ? [] : [penalty.id];
  }

  async deletePenalties(ids: string | string[]) {
    const ans = await this.penaltyRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
