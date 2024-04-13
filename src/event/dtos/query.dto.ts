import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { EventTypeEnum } from "src/enums";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { FilterOptionsSeasonDto, OrderOptionsSeasonDto } from "src/job/dtos/jobGetQuery.dto";
import { FilterOptionsCompanyDto, OrderOptionsCompanyDto } from "src/recruiter/dtos/recruiterGetQuery.dto";
import {
  FilterOptionsProgramDto,
  FilterOptionsUserDto,
  OrderOptionsProgramDto,
  OrderOptionsUserDto,
} from "src/student/dtos/studentGetQuery.dto";
import {
  createMatchOptionsEnum,
  MatchOptionsBool,
  MatchOptionsDate,
  MatchOptionsNumber,
  MatchOptionsString,
  MatchOptionsUUID,
} from "src/utils/utils.dto";

const eventTypeEnum = createMatchOptionsEnum(EventTypeEnum);

class FilterOptionsJobReturnDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  role?: MatchOptionsString;

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

class FilterOptionsEventsDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsNumber })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsNumber)
  roundNumber?: MatchOptionsNumber;

  @ApiPropertyOptional({ type: createMatchOptionsEnum(EventTypeEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(EventTypeEnum))
  type?: typeof eventTypeEnum;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  metadata?: string;

  @ApiPropertyOptional({ type: MatchOptionsDate })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsDate)
  startDate?: MatchOptionsDate;

  @ApiPropertyOptional({ type: MatchOptionsDate })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsDate)
  endDate?: MatchOptionsDate;

  @ApiPropertyOptional({ type: MatchOptionsBool })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsBool)
  visibleToRecruiter?: MatchOptionsBool;

  @ApiPropertyOptional({ type: FilterOptionsJobReturnDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsJobReturnDto)
  job?: FilterOptionsJobReturnDto;
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

  @ApiPropertyOptional({ type: FilterOptionsProgramDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsProgramDto)
  program?: FilterOptionsProgramDto;
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
}

class FilterOptionsApplicationDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: FilterOptionsStudentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsStudentDto)
  student?: FilterOptionsStudentDto;

  @ApiPropertyOptional({ type: FilterOptionsResumeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsResumeDto)
  resume?: FilterOptionsResumeDto;
}

class OrderOptionsJobDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  role?: OrderByEnum;

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

class OrderOptionsEventsDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  roundNumber?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  type?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  metadata?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  startDate?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  endDate?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsJobDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsJobDto)
  job?: OrderOptionsJobDto;
}

class OrderOptionsStudentDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

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

class OrderOptionsApplicationDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsStudentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsStudentDto)
  student?: OrderOptionsStudentDto;
}

export class EventQueryDto {
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

  @ApiPropertyOptional({ type: FilterOptionsEventsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsEventsDto)
  filterBy?: FilterOptionsEventsDto;

  @ApiPropertyOptional({ type: OrderOptionsEventsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsEventsDto)
  orderBy?: OrderOptionsEventsDto;
}

export class ApplicationQueryDto {
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

  @ApiPropertyOptional({ type: FilterOptionsApplicationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsApplicationDto)
  filterBy?: FilterOptionsApplicationDto;

  @ApiPropertyOptional({ type: OrderOptionsApplicationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsApplicationDto)
  orderBy?: OrderOptionsApplicationDto;
}
