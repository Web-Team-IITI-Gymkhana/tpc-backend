import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsUUID, IsEnum, IsArray, ValidateNested, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { IndustryDomainEnum } from "src/enums/industryDomains.enum";
import { CompanyCategoryEnum } from "src/enums";
import { AddressDto } from "src/job/dtos/jaf.dto";

export class UpdateCompanyDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ enum: IndustryDomainEnum, isArray: true, name: "domains(give complete object on change.)" })
  @IsOptional()
  @IsEnum(IndustryDomainEnum, { each: true })
  @IsArray()
  domains?: IndustryDomainEnum[];

  @ApiPropertyOptional({ enum: CompanyCategoryEnum })
  @IsOptional()
  @IsEnum(CompanyCategoryEnum)
  category?: CompanyCategoryEnum;

  @ApiPropertyOptional({ type: AddressDto, name: "address(give complete object on change)." })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  size?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  yearOfEstablishment?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  annualTurnover?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  socialMediaLink?: string;
}
