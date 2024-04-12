import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { MatchOptionsBool, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";
import { Type } from "class-transformer";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { FilterOptionsSeasonDto, OrderOptionsSeasonDto } from "src/job/dtos/jobGetQuery.dto";

class FilterOptionsUserDto {
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
  email?: MatchOptionsString;
}

class OrderOptionsUserDto {
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
  email?: OrderByEnum;
}

class FilterOptionsStudentDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  rollNo?: MatchOptionsString;

  @ApiPropertyOptional({ type: FilterOptionsUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsUserDto)
  user?: FilterOptionsUserDto;
}

class OrderOptionsStudentDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  rollNo?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsUserDto)
  user?: OrderOptionsUserDto;
}

class FilterOptionsRegistrationsDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsBool })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsBool)
  registered?: MatchOptionsBool;

  @ApiPropertyOptional({ type: FilterOptionsStudentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsStudentDto)
  student?: FilterOptionsStudentDto;

  @ApiPropertyOptional({ type: FilterOptionsSeasonDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsSeasonDto)
  season?: FilterOptionsSeasonDto;
}

class OrderOptionsRegistrationsDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  registered?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsStudentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsStudentDto)
  student?: OrderOptionsStudentDto;

  @ApiPropertyOptional({ type: OrderOptionsSeasonDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsSeasonDto)
  season?: OrderOptionsSeasonDto;
}

export class RegistrationsQueryDto {
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

  @ApiPropertyOptional({ type: FilterOptionsRegistrationsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsRegistrationsDto)
  filterBy?: FilterOptionsRegistrationsDto;

  @ApiPropertyOptional({ type: OrderOptionsRegistrationsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsRegistrationsDto)
  orderBy?: OrderOptionsRegistrationsDto;
}
