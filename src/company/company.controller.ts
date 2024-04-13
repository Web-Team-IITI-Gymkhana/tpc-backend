import { Controller, Get, Query, Post, Body, Patch, Delete, Param, ParseUUIDPipe } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CompanyQueryDto, GetCompaniesDto, GetCompanyDto } from "./dtos/get.dto";
import { ApiFilterQuery, createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateCompanyDto } from "./dtos/post.dto";
import { UpdateCompanyDto } from "./dtos/patch.dto";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("companies")
@ApiTags("Company")
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get()
  @ApiFilterQuery("q", CompanyQueryDto)
  @ApiOperation({ description: "Refer to CompanyQueryDto for schema." })
  @ApiResponse({ type: GetCompaniesDto, isArray: true })
  async getCompanies(@Query("q") where: CompanyQueryDto) {
    const ans = await this.companyService.getCompanies(where);

    return pipeTransformArray(ans, GetCompaniesDto);
  }

  @Get("/:id")
  @ApiResponse({ type: GetCompanyDto })
  async getCompany(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.companyService.getCompany(id);

    return pipeTransform(ans, GetCompanyDto);
  }

  @Post()
  @ApiBody({ type: CreateCompanyDto, isArray: true })
  async createCompanies(@Body(createArrayPipe(CreateCompanyDto)) companies: CreateCompanyDto[]) {
    const ans = await this.companyService.createCompanies(companies);

    return ans;
  }

  @Patch()
  @ApiBody({ type: UpdateCompanyDto, isArray: true })
  async updateCompanies(@Body(createArrayPipe(UpdateCompanyDto)) companies: UpdateCompanyDto[]) {
    const pr = companies.map((company) => this.companyService.updateCompany(company));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @Delete()
  async deleteCompanies(@Query("id") ids: string | string[]) {
    const pids = typeof ids === "string" ? [ids] : ids;
    const ans = await this.companyService.deleteCompanies(pids);

    return ans;
  }
}
