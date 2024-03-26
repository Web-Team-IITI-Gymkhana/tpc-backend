import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FindOptions, Transaction } from "sequelize";
import { RECRUITER_DAO, USER_DAO } from "src/constants";
import { CompanyModel, RecruiterModel, UserModel } from "src/db/models";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class RecuiterService {
  constructor(
    @Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
  ) {}

  async getRecruiters(where) {
    // eslint-disable-next-line prefer-const
    let findOptions: FindOptions<RecruiterModel> = {
      include: [
        {
          model: UserModel,
          as: "user",
        },
        {
          model: CompanyModel,
          as: "company",
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

    const ans = await this.recruiterRepo.findAll(findOptions);

    return ans.map((recruiter) => recruiter.get({ plain: true }));
  }

  async getRecruiter(id: string) {
    const ans = await this.recruiterRepo.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
        {
          model: CompanyModel,
          as: "company",
        },
      ],
    });
    if (!ans) throw new NotFoundException(`The Recruiter with id: ${id} Not Found`);

    return ans.get({ plain: true });
  }

  async createRecruiters(recruiters): Promise<string[]> {
    const ans = await this.recruiterRepo.bulkCreate(recruiters, {
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    return ans.map((recruiter) => recruiter.id);
  }

  async updateRecruiter(recruiter, t: Transaction) {
    const ans = await this.recruiterRepo.findByPk(recruiter.id);
    if (!ans) throw new NotFoundException(`The recruiter with id: ${recruiter.id} not found`);

    const pr = [];
    pr.push(
      this.recruiterRepo.update(recruiter, {
        where: { id: ans.id },
        transaction: t,
      })
    );

    if (recruiter.user) {
      pr.push(
        this.userRepo.update(recruiter.user, {
          where: { id: ans.userId },
          transaction: t,
        })
      );
    }

    await Promise.all(pr);

    return true;
  }

  async deleteRecruiter(id, t: Transaction) {
    const ans = await this.recruiterRepo.findByPk(id);
    if (!ans) throw new NotFoundException(`The recruiter with id: ${id} not found`);

    await this.userRepo.destroy({
      where: { id: ans.userId },
    });

    return true;
  }
}
