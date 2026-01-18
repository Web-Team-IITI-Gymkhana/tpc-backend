import { COMPANY_DAO } from "src/constants";
import { CompanyModel, JobModel, SeasonModel } from "src/db/models";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";
import { CompanyQueryDto } from "./dtos/query.dto";
import { CreateCompaniesDto } from "./dtos/post.dto";
import { UpdateCompaniesDto } from "./dtos/patch.dto";

@Injectable()
export class CompanyService {
  constructor(@Inject(COMPANY_DAO) private companyRepo: typeof CompanyModel) {}

  async getCompanies(where: CompanyQueryDto) {
    const findOptions: FindOptions<CompanyModel> = {};
    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    const order = parseOrder(where.orderBy || {});
    findOptions.order = order.length > 0 ? order : [["updatedAt", "DESC"]];

    const ans = await this.companyRepo.findAll(findOptions);

    return ans.map((company) => company.get({ plain: true }));
  }

  async getCompany(id: string) {
    const ans = await this.companyRepo.findByPk(id, {
      include: [
        {
          model: JobModel,
          as: "jobs",
          include: [
            {
              model: SeasonModel,
              as: "season",
            },
          ],
        },
      ],
    });

    if (!ans) throw new NotFoundException(`Company with id ${id} not found`);

    return ans.get({ plain: true });
  }

  async createCompanies(companies: CreateCompaniesDto[]) {
    const ans = await this.companyRepo.bulkCreate(companies);

    return ans.map((company) => company.id);
  }

  async updateCompany(company: UpdateCompaniesDto) {
    const [ans] = await this.companyRepo.update(company, { where: { id: company.id } });

    return ans > 0 ? [] : [company.id];
  }

  async deleteCompanies(ids: string | string[]) {
    const ans = await this.companyRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
