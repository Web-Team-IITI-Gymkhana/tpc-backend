import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { MatchOptionsNumber, MatchOptionsUUID } from "src/utils/utils.dto";

export class FilterOptionsSalaryDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  jobId?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsNumber })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsNumber)
  baseSalary?: MatchOptionsNumber;

  @ApiPropertyOptional({ type: MatchOptionsNumber })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsNumber)
  totalCTC?: MatchOptionsNumber;

  @ApiPropertyOptional({ type: MatchOptionsNumber })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsNumber)
  takeHomeSalary?: MatchOptionsNumber;

  @ApiPropertyOptional({ type: MatchOptionsNumber })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsNumber)
  grossSalary?: MatchOptionsNumber;

  @ApiPropertyOptional({ type: MatchOptionsNumber })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsNumber)
  otherCompensations?: MatchOptionsNumber;
}

export class OrderOptionsSalaryDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  jobId?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  baseSalary?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  totalCTC?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  takeHomeSalary?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  grossSalary?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  otherCompensations?: OrderByEnum;
}

export class GetSalaryQueryDto {
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

  @ApiPropertyOptional({ type: FilterOptionsSalaryDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsSalaryDto)
  filterBy?: FilterOptionsSalaryDto;

  @ApiPropertyOptional({ type: OrderOptionsSalaryDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsSalaryDto)
  orderBy?: OrderOptionsSalaryDto;
}
