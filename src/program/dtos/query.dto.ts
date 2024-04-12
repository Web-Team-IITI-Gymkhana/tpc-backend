import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { createMatchOptionsEnum, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";
import { Type } from "class-transformer";
import { DepartmentEnum } from "src/enums/department.enum";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { Is } from "sequelize-typescript";

const departmentEnum = createMatchOptionsEnum(DepartmentEnum);

class FilterOptionsProgramsDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: string;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  branch?: string;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  course?: string;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  year?: string;

  @ApiPropertyOptional({ enum: createMatchOptionsEnum(DepartmentEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(DepartmentEnum))
  department?: typeof departmentEnum;
}

export class OrderOptionsProgramDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  branch?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  course?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  year?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  department?: OrderByEnum;
}

export class ProgramsQueryDto {
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

  @ApiPropertyOptional({ type: FilterOptionsProgramsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsProgramsDto)
  filterBy?: FilterOptionsProgramsDto;

  @ApiPropertyOptional({ type: OrderOptionsProgramDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsProgramDto)
  orderBy?: OrderOptionsProgramDto;
}
