import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  ParseUUIDPipe,
  ParseArrayPipe,
  UseGuards,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { GetCompaniesDto, GetCompanyDto } from "./dtos/get.dto";
import { CompanyQueryDto } from "./dtos/query.dto";
import { ApiFilterQuery, createArrayPipe, pipeTransform, pipeTransformArray } from "src/utils/utils";
import { CreateCompaniesDto } from "./dtos/post.dto";
import { UpdateCompaniesDto } from "./dtos/patch.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DeleteValues, GetValue, GetValues, PatchValues, PostValues } from "src/decorators/controller";
import { DeleteValuesDto } from "src/utils/utils.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("companies")
@ApiTags("Company")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @GetValues(CompanyQueryDto, GetCompaniesDto)
  async getCompanies(@Query("q") where: CompanyQueryDto) {
    const ans = await this.companyService.getCompanies(where);

    return pipeTransformArray(ans, GetCompaniesDto);
  }

  @GetValue(GetCompanyDto)
  async getCompany(@Param("id", new ParseUUIDPipe()) id: string) {
    const ans = await this.companyService.getCompany(id);

    return pipeTransform(ans, GetCompanyDto);
  }

  @PostValues(CreateCompaniesDto)
  async createCompanies(@Body(createArrayPipe(CreateCompaniesDto)) companies: CreateCompaniesDto[]) {
    const ans = await this.companyService.createCompanies(companies);

    return ans;
  }

  @PatchValues(UpdateCompaniesDto)
  async updateCompanies(@Body(createArrayPipe(UpdateCompaniesDto)) companies: UpdateCompaniesDto[]) {
    const pr = companies.map((company) => this.companyService.updateCompany(company));
    const ans = await Promise.all(pr);

    return ans.flat();
  }

  @DeleteValues()
  async deleteCompanies(@Query() query: DeleteValuesDto) {
    const ans = await this.companyService.deleteCompanies(query.id);

    return ans;
  }
}
