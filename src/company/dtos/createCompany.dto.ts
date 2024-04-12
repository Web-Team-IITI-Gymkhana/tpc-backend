import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsUrl, ValidateNested, IsEmail } from "class-validator";
import { CompanyCategory, Role } from "../../enums";
import IndustryDomain from "../../enums/industryDomains.enum";

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsArray()
  @IsEnum(IndustryDomain, { each: true })
  domains: IndustryDomain[];

  @IsEnum(CompanyCategory)
  category: CompanyCategory;

  @IsString()
  address: string;

  @IsNumber()
  size: number;

  @IsString()
  yearOfEstablishment: string;

  @IsString()
  @IsOptional()
  annualTurnover?: string;

  @IsUrl()
  socialMediaLink: string;
}
