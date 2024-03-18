import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { TPC_MEMBER_DAO } from "src/constants";
import { TpcMemberModel, UserModel } from "src/db/models";
import { TpcMember } from "src/entities/TpcMember";
import { getQueryValues } from "src/utils/utils";

@Injectable()
class TpcMemberService {
  private logger = new Logger(TpcMemberService.name);

  constructor(@Inject(TPC_MEMBER_DAO) private tpcMemberRepo: typeof TpcMemberModel) {}

  async createTpcMember(tpcMember: TpcMember, t?: Transaction) {
    const tpcMemberModel = await this.tpcMemberRepo.create(omit(tpcMember, "user"), { transaction: t });

    return TpcMember.fromModel(tpcMemberModel);
  }

  async getOrCreateTpcMember(tpcMember: TpcMember, t?: Transaction) {
    const [tpcMemberModel] = await this.tpcMemberRepo.findOrCreate({
      where: { userId: tpcMember.userId },
      defaults: omit(tpcMember, "user"),
      transaction: t,
    });

    return TpcMember.fromModel(tpcMemberModel);
  }

  async addTpcMembers(tpcMembers?: TpcMember[], t?: Transaction) {
    const tpcMemberModels = await this.tpcMemberRepo.bulkCreate(
      tpcMembers.map((tpcMember) => omit(tpcMember, "user")),
      { transaction: t }
    );

    return tpcMemberModels.map((tpcMemberModel) => TpcMember.fromModel(tpcMemberModel));
  }

  async getTpcMembers(
    whereTpcMembers?: WhereOptions<TpcMemberModel>,
    whereUser?: WhereOptions<UserModel>,
    t?: Transaction
  ) {
    const valuesStudent = getQueryValues(whereTpcMembers);
    const valuesUser = getQueryValues(whereUser);
    const tpcMemberModels = await this.tpcMemberRepo.findAll({
      where: valuesStudent,
      transaction: t,
      include: { model: UserModel, where: valuesUser, required: true },
    });

    return tpcMemberModels.map((tpcMemberModel) => TpcMember.fromModel(tpcMemberModel));
  }

  async deleteTpcMember(tpcMemberId: string, t?: Transaction) {
    return !!(await this.tpcMemberRepo.destroy({ where: { id: tpcMemberId }, transaction: t }));
  }

  async updateTpcMember(tpcMemberId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.tpcMemberRepo.update(fieldsToUpdate, {
      where: { id: tpcMemberId },
      returning: true,
      transaction: t,
    });

    return TpcMember.fromModel(updatedModel[0]);
  }
}

export default TpcMemberService;
