import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsUrl, IsUUID } from "class-validator";
import { IndustryDomainEnum } from "../../enums/industryDomains.enum";
import { CompanyCategoryEnum } from "../../enums";

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
  @IsEnum(IndustryDomainEnum, { each: true })
  @IsOptional()
  domains?: IndustryDomainEnum[];

  @IsEnum(CompanyCategoryEnum)
  @IsOptional()
  category?: CompanyCategoryEnum;

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
