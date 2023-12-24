import { Inject, Injectable, Logger } from "@nestjs/common";
import { Transaction } from "sequelize";
import { COMPANY_DAO } from "src/constants";
import { CompanyModel } from "src/db/models";
import { Company } from "src/entities/Company";

@Injectable()
class CompanyService {
  private logger = new Logger(CompanyService.name);

  constructor(@Inject(COMPANY_DAO) private companyRepo: typeof CompanyModel) {}

  async createCompany(company: Company, t?: Transaction) {
    const companyModel = await this.companyRepo.create(company, { transaction: t });
    return Company.fromModel(companyModel);
  }

  async deleteCompany(companyId: string, t?: Transaction) {
    await this.companyRepo.destroy({ where: { id: companyId }, transaction: t });
  }
}

export default CompanyService;
