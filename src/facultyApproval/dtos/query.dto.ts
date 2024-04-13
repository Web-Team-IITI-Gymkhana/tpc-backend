import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { FacultyApprovalStatusEnum } from "src/enums/facultyApproval.enum";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { FilterOptionsSeasonDto, OrderOptionsSeasonDto } from "src/job/dtos/jobGetQuery.dto";
import { FilterOptionsCompanyDto, OrderOptionsCompanyDto } from "src/recruiter/dtos/recruiterGetQuery.dto";
import { FilterOptionsUserDto, OrderOptionsUserDto } from "src/student/dtos/studentGetQuery.dto";
import { createMatchOptionsEnum, MatchOptionsNumber, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

class FilterOptionsFacultyDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  department?: MatchOptionsString;

  @ApiPropertyOptional({ type: FilterOptionsUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsUserDto)
  user?: FilterOptionsUserDto;
}

class OrderOptionsFacultyDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  department?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsUserDto)
  user?: OrderOptionsUserDto;
}

class FilterOptionsJobDto {
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

  @ApiPropertyOptional({ type: FilterOptionsSeasonDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsSeasonDto)
  season?: FilterOptionsSeasonDto;

  @ApiPropertyOptional({ type: FilterOptionsCompanyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsCompanyDto)
  company?: FilterOptionsCompanyDto;
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

  @ApiPropertyOptional({ type: OrderOptionsSeasonDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsSeasonDto)
  season?: OrderOptionsSeasonDto;

  @ApiPropertyOptional({ type: OrderOptionsCompanyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsCompanyDto)
  company?: OrderOptionsCompanyDto;
}

class FilterOptionsSalaryDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsNumber })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsNumber)
  totalCTC?: MatchOptionsNumber;

  @ApiPropertyOptional({ type: FilterOptionsJobDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsJobDto)
  job?: FilterOptionsJobDto;
}

class OrderOptionsSalaryDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  totalCTC?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsJobDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsJobDto)
  job?: OrderOptionsJobDto;
}

const fsenum = createMatchOptionsEnum(FacultyApprovalStatusEnum);

class FilterOptionsFacultyApprovalsDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: createMatchOptionsEnum(FacultyApprovalStatusEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(FacultyApprovalStatusEnum))
  status?: typeof fsenum;

  @ApiPropertyOptional({ type: FilterOptionsFacultyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsFacultyDto)
  faculty?: FilterOptionsFacultyDto;

  @ApiPropertyOptional({ type: FilterOptionsSalaryDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsSalaryDto)
  salary?: FilterOptionsSalaryDto;
}

class OrderOptionsFacultyApprovalDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  status?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsFacultyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsFacultyDto)
  faculty?: OrderOptionsFacultyDto;

  @ApiPropertyOptional({ type: OrderOptionsSalaryDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsSalaryDto)
  salary?: OrderOptionsSalaryDto;
}

export class FacultyApprovalQueryDto {
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

  @ApiPropertyOptional({ type: FilterOptionsFacultyApprovalsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsFacultyApprovalsDto)
  filterBy?: FilterOptionsFacultyApprovalsDto;

  @ApiPropertyOptional({ type: OrderOptionsFacultyApprovalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsFacultyApprovalDto)
  orderBy?: OrderOptionsFacultyApprovalDto;
}
