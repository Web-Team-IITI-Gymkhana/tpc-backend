import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, ValidateNested, IsEnum, IsNumber } from "class-validator";
import { MatchOptionsString, MatchOptionsNumber, MatchOptionsUUID } from "src/utils/utils.dto";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { Type } from "class-transformer";
import { CategoryEnum, RoleEnum } from "src/enums";
import { GetSeasonsReturnDto } from "./jobGetReturn.dto";
import { GetCompaniesReturnDto } from "src/recruiter/dtos/recruiterGetReturn.dto";
import { FilterOptionsCompanyDto, OrderOptionsCompanyDto } from "src/recruiter/dtos/recruiterGetQuery.dto";

export class FilterOptionsSeasonsDto {
  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  id?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  year?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  type?: MatchOptionsString;
}

export class OrderOptionsSeasonsDto {
  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  year?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  type?: OrderByEnum;
}

class FilterOptionsJobDto {
  @ApiPropertyOptional({
    type: MatchOptionsUUID,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => String)
  role?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => String)
  currentStatus?: MatchOptionsString;

  @ApiPropertyOptional({
    type: FilterOptionsCompanyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsCompanyDto)
  company?: FilterOptionsCompanyDto;

  // to be done
  @ApiPropertyOptional({
    type: FilterOptionsSeasonsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsSeasonsDto)
  season?: FilterOptionsSeasonsDto;
}

class OrderOptionsJobDto {
  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  role?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  currentStatus?: OrderByEnum;

  @ApiPropertyOptional({
    type: OrderOptionsCompanyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsCompanyDto)
  company?: OrderOptionsCompanyDto;

  @ApiPropertyOptional({
    type: OrderOptionsSeasonsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsSeasonsDto)
  season?: OrderOptionsSeasonsDto;
}

export class GetJobQueryDto {
  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  from?: number;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  to?: number;

  @ApiPropertyOptional({
    type: FilterOptionsJobDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsJobDto)
  filterBy?: FilterOptionsJobDto;

  @ApiPropertyOptional({
    type: OrderOptionsJobDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsJobDto)
  orderBy?: OrderOptionsJobDto;
}
