import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { JobStatusTypeEnum, SeasonTypeEnum } from "src/enums";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { FilterOptionsCompanyDto, OrderOptionsCompanyDto } from "src/recruiter/dtos/recruiterGetQuery.dto";
import { createMatchOptionsEnum, MatchOptionsBool, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

export class FilterOptionsSeasonDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  year?: MatchOptionsString;

  @ApiPropertyOptional({ enum: createMatchOptionsEnum(SeasonTypeEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(SeasonTypeEnum))
  type?: string;
}

export class FilterOptionsJobsDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  //Remove this.
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  seasonId?: MatchOptionsUUID;

  //Remove this.
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  companyId?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  recruiterId?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  role?: MatchOptionsString;

  @ApiPropertyOptional({ type: MatchOptionsBool })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsBool)
  active?: MatchOptionsBool;

  @ApiPropertyOptional({ enum: createMatchOptionsEnum(JobStatusTypeEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(JobStatusTypeEnum))
  currentStatus?: string;

  @ApiPropertyOptional({ type: FilterOptionsCompanyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsCompanyDto)
  company?: FilterOptionsCompanyDto;

  @ApiPropertyOptional({ type: FilterOptionsSeasonDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsSeasonDto)
  season?: FilterOptionsSeasonDto;
}

export class OrderOptionsSeasonDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  year?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  type?: OrderByEnum;
}

export class OrderOptionsJobsDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  seasonId?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  companyId?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  recruiterId?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  role?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  active?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  currentStatus?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsCompanyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsCompanyDto)
  company?: OrderOptionsCompanyDto;

  @ApiPropertyOptional({ type: OrderOptionsSeasonDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsSeasonDto)
  season?: OrderOptionsSeasonDto;
}

export class GetJobQueryDto {
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

  @ApiPropertyOptional({ type: FilterOptionsJobsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsJobsDto)
  filterBy?: FilterOptionsJobsDto;

  @ApiPropertyOptional({ type: OrderOptionsJobsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsJobsDto)
  orderBy?: OrderOptionsJobsDto;
}
