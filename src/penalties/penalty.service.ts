import { Inject, Injectable } from "@nestjs/common";
import { PENALTY_DAO } from "src/constants";
import { PenaltyModel } from "src/db/models";

@Injectable()
export class PenaltyService {
  constructor(@Inject(PENALTY_DAO) private penaltyRepo: typeof PenaltyModel) {}

  async getPenalties(where) {
    return where;
  }

  async createPenalties(penalties) {
    return penalties;
  }

  async updatePenalty(penalty) {
    return penalty;
  }

  async deletePenalties(ids) {
    return ids;
  }
}
