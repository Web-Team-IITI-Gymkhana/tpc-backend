import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsUrl, IsUUID, ValidateNested } from "class-validator";
import { IndustryDomainEnum } from "../../enums/industryDomains.enum";
import { CompanyCategoryEnum } from "../../enums";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class UpdateCompanyDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ type: IndustryDomainEnum, isArray: true })
  @IsArray()
  @ValidateNested()
  @IsEnum(IndustryDomainEnum, { each: true })
  @IsOptional()
  domains?: IndustryDomainEnum[];

  @ApiPropertyOptional({ type: CompanyCategoryEnum })
  @IsEnum(CompanyCategoryEnum)
  @IsOptional()
  category?: CompanyCategoryEnum;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  size?: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  yearOfEstablishment?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  annualTurnover?: string;

  @ApiPropertyOptional({ type: String })
  @IsUrl()
  @IsOptional()
  socialMediaLink?: string;
}
