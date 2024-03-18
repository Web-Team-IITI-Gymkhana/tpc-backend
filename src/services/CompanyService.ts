import { Inject, Injectable, Logger } from "@nestjs/common";
import { omit } from "lodash";
import { Transaction, WhereOptions } from "sequelize";
import { COMPANY_DAO } from "src/constants";
import { CompanyModel, JobModel } from "src/db/models";
import { Company } from "src/entities/Company";

@Injectable()
class CompanyService {
  private logger = new Logger(CompanyService.name);

  constructor(@Inject(COMPANY_DAO) private companyRepo: typeof CompanyModel) {}

  async createCompany(company: Company, t?: Transaction) {
    const companyModel = await this.companyRepo.create(omit(company, "jobs"), { transaction: t });

    return Company.fromModel(companyModel);
  }

  async getCompanies(where?: WhereOptions<CompanyModel>, t?: Transaction) {
    const companyModels = await this.companyRepo.findAll({ where: where, transaction: t });

    return companyModels.map((companyModel) => Company.fromModel(companyModel));
  }

  async updateCompany(companyId: string, fieldsToUpdate: object, t?: Transaction) {
    const [_, updatedModel] = await this.companyRepo.update(fieldsToUpdate, {
      where: { id: companyId },
      returning: true,
      transaction: t,
    });

    return Company.fromModel(updatedModel[0]);
  }

  async deleteCompany(companyId: string, t?: Transaction) {
    return !!(await this.companyRepo.destroy({ where: { id: companyId }, transaction: t }));
  }
}

export default CompanyService;
