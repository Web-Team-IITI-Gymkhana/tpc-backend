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
    const ans = await this.tpcMemberRepo.bulkCreate(tpcMembers, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    return ans.map((tpcMember) => tpcMember.id);
  }

  async updateTpcMember(tpcMember, t: Transaction) {
    const ans = await this.tpcMemberRepo.findByPk(tpcMember.id);
    if (!ans) throw new NotFoundException(`The id: ${tpcMember.id} Not Found`);

    const pr = [];
    pr.push(
      this.tpcMemberRepo.update(tpcMember, {
        where: { id: ans.id },
        transaction: t,
      })
    );

    if (tpcMember.user) {
      pr.push(
        this.userRepo.update(tpcMember.user, {
          where: { id: ans.userId },
          transaction: t,
        })
      );
    }

    await Promise.all(pr);

    return true;
  }

  async deleteTpcMembers(ids: string[]) {
    const ans = await this.tpcMemberRepo.findAll({ where: { id: ids }, attributes: ["userId"] });
    const userIds = ans.map((tpcMember) => tpcMember.userId);
    const res = await this.userRepo.destroy({ where: { id: userIds } });

    return res;
  }
}
