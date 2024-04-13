import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsUUID, IsEnum, IsArray, ValidateNested, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { IndustryDomainEnum } from "src/enums/industryDomains.enum";
import { CompanyCategoryEnum } from "src/enums";
import { AddressDto } from "src/job/dtos/jaf.dto";

export class CreateCompanyDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ enum: IndustryDomainEnum, isArray: true })
  @IsEnum(IndustryDomainEnum, { each: true })
  @IsArray()
  domains: IndustryDomainEnum[];

  @ApiProperty({ enum: CompanyCategoryEnum })
  @IsEnum(CompanyCategoryEnum)
  category: CompanyCategoryEnum;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  size?: number;

  @ApiProperty({ type: String })
  @IsString()
  yearOfEstablishment: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  annualTurnover?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  socialMediaLink?: string;
}
