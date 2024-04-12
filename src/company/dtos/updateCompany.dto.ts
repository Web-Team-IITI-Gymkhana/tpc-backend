import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsUrl, IsUUID } from "class-validator";
import IndustryDomain from "../../enums/industryDomains.enum";
import { CompanyCategory } from "../../enums";

export class UpdateCompanyDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsArray()
  @IsEnum(IndustryDomain, { each: true })
  @IsOptional()
  domains?: IndustryDomain[];

  @IsEnum(CompanyCategory)
  @IsOptional()
  category?: CompanyCategory;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsString()
  @IsOptional()
  yearOfEstablishment?: string;

  @IsString()
  @IsOptional()
  annualTurnover?: string;

  @IsUrl()
  @IsOptional()
  socialMediaLink?: string;
}
