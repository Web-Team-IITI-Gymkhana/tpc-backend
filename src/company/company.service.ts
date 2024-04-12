import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateCompanyDto } from "./dtos/updateCompany.dto";
import { GetCompanyQueryDto } from "./dtos/companyGetQuery.dto";
import { FindOptions, Transaction } from "sequelize";
import { CompanyModel, JobModel } from "../db/models";
import { parseFilter, parseOrder, parsePagesize } from "../utils";
import { COMPANY_DAO } from "../constants"; // Assuming you have these DTO

@Injectable()
export class CompanyService {
  constructor(@Inject(COMPANY_DAO) private companyRepo: typeof CompanyModel) {}

  async getAllCompanies(where: GetCompanyQueryDto) {
    const findOptions: FindOptions<CompanyModel> = {
      include: [
        {
          model: JobModel,
          as: "job",
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

    const companies = await this.companyRepo.findAll(findOptions);

    return companies.map((company) => company.get({ plain: true }));
  }

  async createCompany(body, t: Transaction) {
    const createdIds = [];

    try {
      for (const item of body) {
        const createdItem = await this.companyRepo.create(item, { transaction: t });
        createdIds.push(createdItem.id);
      }

      await t.commit();

      return createdIds;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async updateCompany(ids: UpdateCompanyDto[], t: Transaction) {
    const updatedCompanyIds: string[] = [];

    try {
      // Loop through each ID and update the corresponding company record
      for (const id of ids) {
        // Find the existing company record by ID
        const company = await this.companyRepo.findByPk(id.id, { transaction: t });

        // If company not found, throw NotFoundException
        if (!company) {
          throw new NotFoundException(`Company with ID ${id.id} not found`);
        }

        // Update only the properties present in updateCompanyDto
        Object.assign(company, id);

        // Save the updated company record
        await company.save({ transaction: t });
        // Push the ID of the updated company to the array
        updatedCompanyIds.push(company.id);
      }

      // Commit the transaction
      await t.commit();

      // Return the array of updated company IDs
      return updatedCompanyIds;
    } catch (error) {
      // Rollback the transaction if an error occurs
      await t.rollback();
      throw error;
    }
  }

  async deleteCompany(ids: string[], t: Transaction) {
    try {
      // Delete all rows with the given IDs
      const rowsDeleted = await this.companyRepo.destroy({ where: { id: ids }, transaction: t });

      // Commit the transaction
      await t.commit();

      // Return the number of rows deleted
      return rowsDeleted;
    } catch (error) {
      // Rollback the transaction if an error occurs
      await t.rollback();
      throw error;
    }
  }
}
