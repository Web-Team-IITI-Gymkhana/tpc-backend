import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsUrl, ValidateNested, IsEmail } from "class-validator";
import { IndustryDomainEnum } from "../../enums/industryDomains.enum";
import { CompanyCategoryEnum } from "../../enums";

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsArray()
  @IsEnum(IndustryDomainEnum, { each: true })
  domains: IndustryDomainEnum[];

  @IsEnum(CompanyCategoryEnum)
  category: CompanyCategoryEnum;

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
