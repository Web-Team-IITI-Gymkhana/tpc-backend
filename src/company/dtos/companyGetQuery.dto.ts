import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, ValidateNested, IsNumber, IsUUID, IsString, IsUrl, IsArray, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { IndustryDomainEnum } from "../../enums/industryDomains.enum";
import { CompanyCategoryEnum } from "../../enums";
import {
  createMatchOptionsEnum,
  MatchOptionsNumber,
  MatchOptionsString,
  MatchOptionsUUID,
} from "../../utils/utils.dto";

export class FilterOptionsCompanyDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: string;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @ValidateNested()
  @IsOptional()
  @Type(() => MatchOptionsString)
  name?: MatchOptionsString;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @ValidateNested()
  @IsUrl()
  @IsOptional()
  @Type(() => MatchOptionsString)
  website?: MatchOptionsString;

  @ApiProperty({ enum: IndustryDomainEnum, isArray: true })
  @IsArray()
  @IsEnum(IndustryDomainEnum, { each: true })
  @Type(() => createMatchOptionsEnum(IndustryDomainEnum))
  domains: string[];

  @ApiPropertyOptional({ type: createMatchOptionsEnum(CompanyCategoryEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(CompanyCategoryEnum))
  category?: string;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @ValidateNested()
  @IsOptional()
  @Type(() => MatchOptionsString)
  address?: MatchOptionsString;

  @ApiPropertyOptional({ type: MatchOptionsNumber })
  @ValidateNested()
  @IsOptional()
  @Type(() => MatchOptionsNumber)
  size?: MatchOptionsNumber;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @ValidateNested()
  @IsOptional()
  @Type(() => MatchOptionsString)
  yearOfEstablishment?: MatchOptionsString;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @ValidateNested()
  @IsOptional()
  @Type(() => MatchOptionsString)
  annualTurnover?: MatchOptionsString;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @ValidateNested()
  @IsOptional()
  @Type(() => MatchOptionsString)
  socialMediaLink?: MatchOptionsString;
}

export class OrderOptionsCompanyDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  name?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  website?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  domains?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  category?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  address?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  size?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  yearOfEstablishment?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  annualTurnover?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  socialMediaLink?: OrderByEnum;
}

export class GetCompanyQueryDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  from?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  to?: number;

  @ApiPropertyOptional({ type: FilterOptionsCompanyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsCompanyDto)
  filterBy?: FilterOptionsCompanyDto;

  @ApiPropertyOptional({ type: OrderOptionsCompanyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsCompanyDto)
  orderBy?: OrderOptionsCompanyDto;
}
