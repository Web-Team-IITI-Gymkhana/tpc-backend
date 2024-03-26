import { Inject, Injectable } from "@nestjs/common";
import { FindOptions } from "sequelize";
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

    return ans.get({ plain: true });
  }
}
