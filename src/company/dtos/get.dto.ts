import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested, IsArray, IsBoolean } from "class-validator";
import { CompanyCategoryEnum, JobStatusTypeEnum } from "src/enums";
import { IndustryDomainEnum } from "src/enums/industryDomains.enum";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { AddressDto } from "src/job/dtos/jaf.dto";
import { GetSeasonsReturnDto } from "src/job/dtos/jobGetReturn.dto";
import { createMatchOptionsEnum, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

export class GetCompaniesDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ enum: CompanyCategoryEnum })
  @IsEnum(CompanyCategoryEnum)
  category: CompanyCategoryEnum;

  @ApiProperty({ type: String })
  @IsString()
  yearOfEstablishment: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  size?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  annualTurnover?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  socialMediaLink?: string;
}

const companyCategory = createMatchOptionsEnum(CompanyCategoryEnum);

class FilterOptionsCompanyDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  name?: MatchOptionsString;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  yearOfEstablishment?: MatchOptionsString;

  @ApiPropertyOptional({ type: createMatchOptionsEnum(CompanyCategoryEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(CompanyCategoryEnum))
  category?: typeof companyCategory;
}

class OrderOptionsCompanyDto {
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
  yearOfEstablishment?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  category?: OrderByEnum;
}

export class CompanyQueryDto {
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

class JobReturnDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  role: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ enum: JobStatusTypeEnum })
  @IsEnum(JobStatusTypeEnum)
  currentStatus: JobStatusTypeEnum;

  @ApiProperty({ type: GetSeasonsReturnDto })
  @ValidateNested()
  @Type(() => GetSeasonsReturnDto)
  season: GetSeasonsReturnDto;
}

export class GetCompanyDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

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

  @ApiProperty({ type: JobReturnDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => JobReturnDto)
  jobs: JobReturnDto[];
}
