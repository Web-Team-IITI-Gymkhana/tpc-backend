import { Controller, Get, Post, Patch, Delete, Body, Query, ParseArrayPipe, UseInterceptors } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dtos/createCompany.dto";
import { UpdateCompanyDto } from "./dtos/updateCompany.dto";
import { GetCompanyQueryDto } from "./dtos/companyGetQuery.dto";
import { ApiBody, ApiQuery } from "@nestjs/swagger";
import { TransactionInterceptor } from "../interceptor/TransactionInterceptor";
import { TransactionParam } from "../decorators/TransactionParam";
import { Transaction } from "sequelize";

@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getAllCompanies(@Query("q") where: GetCompanyQueryDto) {
    try {
      const companies = await this.companyService.getAllCompanies(where);

      return { success: true, message: "Success", data: companies };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @ApiBody({ type: CreateCompanyDto, isArray: true })
  async createCompany(
    @Body(new ParseArrayPipe({ items: CreateCompanyDto })) body: CreateCompanyDto[],
    @TransactionParam() t: Transaction
  ) {
    try {
      const createdCompanyIds = await this.companyService.createCompany(body, t);

      return { success: true, message: "Created Successfully", data: createdCompanyIds };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Patch()
  @ApiBody({ type: UpdateCompanyDto, isArray: true })
  async updateCompany(
    @Body(new ParseArrayPipe({ items: UpdateCompanyDto })) body: UpdateCompanyDto[],
    @TransactionParam() t: Transaction
  ) {
    try {
      const updatedCompanyIds = await this.companyService.updateCompany(body, t);

      return { success: true, message: "Updated Successfully", data: updatedCompanyIds };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Delete()
  @ApiQuery({ name: "id", type: String, isArray: true })
  @UseInterceptors(TransactionInterceptor)
  async deleteCompany(@Query("ids") ids: string | string[], @TransactionParam() t: Transaction) {
    try {
      const pids = typeof ids === "string" ? [ids] : ids;
      const num = this.companyService.deleteCompany(pids, t);

      return { success: true, message: "Deleted Successfully", data: num };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
