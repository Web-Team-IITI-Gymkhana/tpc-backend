import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsString, IsUUID, IsArray, ValidateNested, IsNumber, IsOptional } from "class-validator";
import { CategoryEnum, CompanyCategoryEnum, SeasonTypeEnum } from "src/enums";
import { IndustryDomainEnum } from "src/enums/industryDomains.enum";
import { OfferStatusEnum } from "src/enums/offerStatus.enum";

export class SeasonReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  year: string;

  @ApiProperty({ enum: SeasonTypeEnum })
  @IsEnum(SeasonTypeEnum)
  type: SeasonTypeEnum;
}

export class CompanyReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ enum: IndustryDomainEnum, isArray: true })
  @IsArray()
  @IsEnum(IndustryDomainEnum, { each: true })
  domains: IndustryDomainEnum[];

  @ApiProperty({ enum: CompanyCategoryEnum })
  @IsEnum(CompanyCategoryEnum)
  category: CompanyCategoryEnum;
}

export class OffCampusOfferReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: SeasonReturnDto })
  @ValidateNested()
  @Type(() => SeasonReturnDto)
  season: SeasonReturnDto;

  @ApiProperty({ type: CompanyReturnDto })
  @ValidateNested()
  @Type(() => CompanyReturnDto)
  company: CompanyReturnDto;

  @ApiProperty({ type: Number })
  @IsNumber()
  salary: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  salaryPeriod?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  metadata?: string;

  @ApiProperty({ type: String })
  @IsString()
  role: string;

  @ApiProperty({ enum: OfferStatusEnum })
  @IsEnum(OfferStatusEnum)
  status: OfferStatusEnum;
}
