import {
  Body,
  Controller,
  Inject,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Put,
  Param,
  HttpException,
  HttpStatus,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { COMPANY_SERVICE, RECRUITER_SERVICE } from "src/constants";
import CompanyService from "src/services/CompanyService";
import { Company } from "src/entities/Company";
import {  AddCompanyDto, CompanyIdParamDto, UpdateCompanyDto } from "../dtos/company";
import RecruiterService from "src/services/RecruiterService";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("/companies")
@ApiBearerAuth("jwt")
@UseGuards(AuthGuard("jwt"))
export class CompanyController {
  constructor(
    @Inject(COMPANY_SERVICE) private companyService: CompanyService,
    @Inject(RECRUITER_SERVICE) private recruiterService: RecruiterService
  ) {}
  
  // @Post()
  // @UseInterceptors(ClassSerializerInterceptor)
  // async addCompany(@Body() body: AddCompanyDto) {
  //   const company = await this.companyService.createCompany(new Company({
  //     name: body.name,
  //     domains: body.domains,
  //     category: body.category,
  //     address: body.address,
  //     size: body.size,
  //     yearOfEstablishment: body.yearOfEstablishment,
  //     annualTurnover: body.annualTurnover,
  //     socialMediaLink: body.socialMediaLink
  //   }));
  //   return { company: company };
  // }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getCompanies() {
    const companies = await this.companyService.getCompanies();
    return { companies: companies };
  }

  @Put("/:companyId")
  @UseInterceptors(ClassSerializerInterceptor)
  async updateCompany(@Param() param: CompanyIdParamDto, @Body() body: UpdateCompanyDto) {
    const [company] = await this.companyService.getCompanies({ id: param.companyId });
    if (!company) {
      throw new HttpException(`Company with companyId: ${param.companyId} not found`, HttpStatus.NOT_FOUND);
    }
    const updatedCompany = await this.companyService.updateCompany(company.id, body);
    return { company: updatedCompany };
  }

  @Delete("/:companyId")
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteCompany(@Param() param: CompanyIdParamDto) {
    const deleted = await this.companyService.deleteCompany(param.companyId);
    return { deleted: deleted };
  }

  @Get("/:companyId/recruiters")
  @UseInterceptors(ClassSerializerInterceptor)
  async getCompanyRecruiters(@Param() param: CompanyIdParamDto) {
    const recruiters = await this.recruiterService.getRecruiters({ companyId: param.companyId });
    return { recruiters: recruiters };
  }
}
