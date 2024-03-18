import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CompanyCategory } from "src/db/enums";
import { AddressDto } from "./jaf";
import {
  IsEnum,
  IsNegative,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CompanyIdParamDto {
  @ApiProperty()
  companyId: string;
}

export class CompanyMetadataDto {
  @ApiPropertyOptional({
    type: String,
  })
  description?: string;
  @ApiPropertyOptional({
    type: String,
  })
  logo?: string;
}

export class AddCompanyDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: CompanyMetadataDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CompanyMetadataDto)
  @IsOptional()
  metadata?: CompanyMetadataDto;

  @ApiProperty({
    type: String,
  })
  @IsString()
  domains: string;

  @ApiProperty({
    type: "enum",
    enum: CompanyCategory,
  })
  @IsEnum(CompanyCategory)
  @IsOptional()
  category?: CompanyCategory;

  @ApiProperty({
    type: AddressDto,
  })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  size?: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  yearOfEstablishment: number;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  annualTurnover?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsUrl()
  @IsOptional()
  socialMediaLink?: string;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    type: CompanyMetadataDto,
  })
  metadata?: CompanyMetadataDto;
}
