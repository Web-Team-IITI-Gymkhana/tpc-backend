import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { FindOptions } from "sequelize";
import { COMPANY_DAO } from "src/constants";
import { CompanyModel, JobModel, SeasonModel } from "src/db/models";
import { parseFilter, parseOrder, parsePagesize } from "src/utils";

@Injectable()
export class CompanyService {
  constructor(@Inject(COMPANY_DAO) private companyRepo: typeof CompanyModel) {}

  async getCompanies(where) {
    const findOptions: FindOptions<CompanyModel> = {};
    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    parseFilter(findOptions, where.filterBy || {});
    findOptions.order = parseOrder(where.orderBy || {});

    const ans = await this.companyRepo.findAll(findOptions);

    return ans.map((company) => company.get({ plain: true }));
  }

  async getCompany(id: string) {
    const ans = await this.companyRepo.findByPk(id, {
      include: [{ model: JobModel, as: "job", include: [{ model: SeasonModel, as: "season" }] }],
    });

    if (!ans) throw new NotFoundException(`The Company with id: ${id} Not found`);

    return ans.get({ plain: true });
  }

  async createCompanies(companies) {
    const ans = await this.companyRepo.bulkCreate(companies);

    return ans.map((company) => company.id);
  }

  async updateCompany(company) {
    const [ans] = await this.companyRepo.update(company, { where: { id: company.id } });

    return ans > 0 ? [] : [company.id];
  }

  async deleteCompanies(ids: string[]) {
    const ans = await this.companyRepo.destroy({ where: { id: ids } });

    return ans;
  }
}
