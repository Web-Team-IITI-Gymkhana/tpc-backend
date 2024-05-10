import { Body, Controller, Delete, Get, ParseArrayPipe, Patch, Post, Query } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dtos/createCompany.dto";
import { UpdateCompanyDto } from "./dtos/updateCompany.dto";
import { GetCompanyQueryDto } from "./dtos/companyGetQuery.dto";
import { ApiBody, ApiQuery } from "@nestjs/swagger";
import { pipeTransformArray } from "../utils/utils";
import { GetCompanyReturnDto } from "../recruiter/dtos/recruiterGetReturn.dto";

@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getAllCompanies(@Query("q") where: GetCompanyQueryDto) {
    const companies = await this.companyService.getAllCompanies(where);

    return pipeTransformArray(companies, GetCompanyReturnDto);
  }

  @Post()
  @ApiBody({ type: CreateCompanyDto, isArray: true })
  async createCompany(@Body(new ParseArrayPipe({ items: CreateCompanyDto })) body: CreateCompanyDto[]) {
    return await this.companyService.createCompany(body);
  }

  @Patch()
  @ApiBody({ type: UpdateCompanyDto, isArray: true })
  async updateCompany(@Body(new ParseArrayPipe({ items: UpdateCompanyDto })) companies: UpdateCompanyDto[]) {
    const pr = companies.map((company) => this.companyService.updateCompany(company));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @Delete()
  @ApiQuery({ name: "id", type: String, isArray: true })
  async deleteCompany(@Query("ids") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const num = await this.companyService.deleteCompany(pids);

    return num;
  }
}
