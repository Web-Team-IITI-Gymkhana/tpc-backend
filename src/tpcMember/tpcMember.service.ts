import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FindOptions, Transaction } from "sequelize";
import { TPC_MEMBER_DAO, USER_DAO } from "src/constants";
import { CompanyModel, JobCoordinatorModel, JobModel, SeasonModel, TpcMemberModel, UserModel } from "src/db/models";
import { parsePagesize, parseFilter, parseOrder } from "src/utils";

@Injectable()
export class TpcMemberService {
  constructor(
    @Inject(TPC_MEMBER_DAO) private tpcMemberRepo: typeof TpcMemberModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
  ) {}

  async getTpcMembers(where) {
    const findOptions: FindOptions<TpcMemberModel> = {
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    };

    // Add page size options
    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    // Apply filter
    parseFilter(findOptions, where.filterBy || {});
    // Apply order
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.tpcMemberRepo.findAll(findOptions);

    return ans.map((tpcMember) => tpcMember.get({ plain: true }));
  }

  async getTpcMember(id: string) {
    const ans = await this.tpcMemberRepo.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
        {
          model: JobCoordinatorModel,
          as: "jobCoordinators",
          include: [
            {
              model: JobModel,
              as: "job",
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
            },
          ],
        },
      ],
    });
    if (!ans) throw new NotFoundException(`The TPC Member with id: ${id} Not Found`);

    return ans.get({ plain: true });
  }

  async createTpcMembers(tpcMembers) {
    const ans = await this.tpcMemberRepo.bulkCreate(tpcMembers);

    return ans.map((tpcMember) => tpcMember.id);
  }

  async updateTpcMember(tpcMember) {
    const [ans] = await this.tpcMemberRepo.update(tpcMember, { where: { id: tpcMember.id } });

    return ans > 0 ? [] : [tpcMember.id];
  }

  async deleteTpcMembers(ids: string[]) {
    const ans = await this.tpcMemberRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
