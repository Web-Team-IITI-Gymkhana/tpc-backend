import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RECRUITER_DAO, USER_DAO } from "src/constants";
import { CompanyModel, JobModel, RecruiterModel, SalaryModel, SeasonModel, UserModel } from "src/db/models";
import { RecruiterQueryDto } from "./dtos/query.dto";
import { FindOptions, Transaction } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { RoleEnum } from "src/enums";
import { UpdateRecuitersDto } from "./dtos/patch.dto";
import { omit } from "lodash";
import sequelize from "sequelize";

@Injectable()
export class RecruiterService {
  constructor(
    @Inject(RECRUITER_DAO) private recruiterRepo: typeof RecruiterModel,
    @Inject(USER_DAO) private userRepo: typeof UserModel
  ) {}

  async getRecuiters(where: RecruiterQueryDto) {
    const findOptions: FindOptions<RecruiterModel> = {
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

    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
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
        {
          model: JobModel,
          as: "jobs",
          include: [
            {
              model: SeasonModel,
              as: "season",
            },
            {
              model: CompanyModel,
              as: "company",
            },
            {
              model: SalaryModel,
              as: "salaries",
            },
          ],
        },
      ],
    });

    if (!ans) throw new NotFoundException(`Recruiter with id ${id} not found`);

    return ans.get({ plain: true });
  }

  async createRecruiters(body) {
    const recruiters = body.map((recruiter) => {
      recruiter.user.role = RoleEnum.RECRUITER;

      return recruiter;
    });
    const ans = await this.recruiterRepo.bulkCreate(recruiters, {
      include: [{ model: UserModel, as: "user" }],
    });

    return ans.map((recruiter) => recruiter.id);
  }

  async updateRecruiter(recruiter: UpdateRecuitersDto, t: Transaction) {
    const [[ans], [res]] = await Promise.all([
      this.recruiterRepo.update(omit(recruiter, "user"), { where: { id: recruiter.id }, transaction: t }),
      this.userRepo.update(recruiter.user, {
        where: sequelize.literal(`"id" IN (SELECT "userId" FROM "Recruiter" WHERE "id" = '${recruiter.id}')`),
        transaction: t,
      }),
    ]);

    return ans > 0 || res > 0 ? [] : [recruiter.id];
  }

  async deleteRecruiters(ids: string[]) {
    const ans = await this.userRepo.destroy({
      where: sequelize.literal(
        `"id" IN (SELECT "userId" FROM "Recruiter" WHERE "id" IN (${ids.map((id) => `'${id}'`).join(",")}))`
      ),
    });

    return ans;
  }
}
