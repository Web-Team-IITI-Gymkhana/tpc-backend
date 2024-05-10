import { Inject, Injectable } from "@nestjs/common";
import { GetCompanyQueryDto } from "./dtos/companyGetQuery.dto";
import { FindOptions } from "sequelize";
import { CompanyModel } from "../db/models";
import { parseFilter, parseOrder, parsePagesize } from "../utils";
import { COMPANY_DAO } from "../constants"; // Assuming you have these DTO

@Injectable()
export class CompanyService {
  constructor(@Inject(COMPANY_DAO) private companyRepo: typeof CompanyModel) {}

  async getAllCompanies(where: GetCompanyQueryDto) {
    const findOptions: FindOptions<CompanyModel> = {
      include: [{}],
    };

    // Add page size options
    const pageOptions = parsePagesize(where);
    Object.assign(findOptions, pageOptions);
    // Apply filter
    parseFilter(findOptions, where.filterBy || {});
    // Apply order
    findOptions.order = parseOrder(where.orderBy || {});

    const companies = await this.companyRepo.findAll(findOptions);

    return companies.map((company) => company.get({ plain: true }));
  }

  async createCompany(body) {
    const ans = await this.companyRepo.bulkCreate(body);

    return ans.map((company) => company.id);
  }

  async updateCompany(company) {
    const id = company.id;
    const [res] = await this.companyRepo.update(company, { where: { id: id } });

    return res > 0 ? [] : [id];
  }

  async deleteCompany(ids: string[]) {
    const rowsDeleted = await this.companyRepo.destroy({ where: { id: ids } });

    // Return the number of rows deleted
    return rowsDeleted;
  }
}
