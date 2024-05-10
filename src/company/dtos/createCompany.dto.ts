import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsUrl, ValidateNested, IsEmail } from "class-validator";
import { IndustryDomainEnum } from "../../enums/industryDomains.enum";
import { CompanyCategoryEnum } from "../../enums";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCompanyDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ type: IndustryDomainEnum, isArray: true })
  @IsArray()
  @IsEnum(IndustryDomainEnum, { each: true })
  domains: IndustryDomainEnum[];

  @ApiProperty({ type: CompanyCategoryEnum })
  @IsEnum(CompanyCategoryEnum)
  category: CompanyCategoryEnum;

  @ApiProperty({ type: String })
  @IsString()
  address: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  size: number;

  @ApiProperty({ type: String })
  @IsString()
  yearOfEstablishment: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  annualTurnover?: string;

  @ApiPropertyOptional({ type: String })
  @IsUrl()
  socialMediaLink: string;
}
