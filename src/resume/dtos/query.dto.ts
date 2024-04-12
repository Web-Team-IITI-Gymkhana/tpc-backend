import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { OrderByEnum } from "src/enums/orderBy.enum";
import {
  FilterOptionsProgramDto,
  FilterOptionsUserDto,
  OrderOptionsProgramDto,
  OrderOptionsUserDto,
} from "src/student/dtos/studentGetQuery.dto";
import { MatchOptionsBool, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

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

  @ApiPropertyOptional({ type: FilterOptionsProgramDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsProgramDto)
  program?: FilterOptionsProgramDto;
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

  @ApiPropertyOptional({ type: OrderOptionsProgramDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsProgramDto)
  program?: OrderOptionsProgramDto;
}

class FilterOptionsResumeDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsBool })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsBool)
  verified?: MatchOptionsBool;

  @ApiPropertyOptional({ type: FilterOptionsStudentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsStudentDto)
  student?: FilterOptionsStudentDto;
}

class OrderOptionsResumeDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  verified?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsStudentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsStudentDto)
  student?: OrderOptionsStudentDto;
}

export class ResumeGetQueryDto {
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

  @ApiPropertyOptional({ type: FilterOptionsResumeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsResumeDto)
  filterBy?: FilterOptionsResumeDto;

  @ApiPropertyOptional({ type: OrderOptionsResumeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsResumeDto)
  orderBy?: OrderOptionsResumeDto;
}
