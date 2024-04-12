import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNegative, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { MatchOptionsNumber, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";
import { Type } from "class-transformer";
import { FilterOptionsUserDto, OrderOptionsUserDto } from "src/student/dtos/studentGetQuery.dto";
import { OrderByEnum } from "src/enums/orderBy.enum";

class FilterOptionsStudentDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

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

  @ApiPropertyOptional({ type: OrderOptionsUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsUserDto)
  user?: OrderOptionsUserDto;
}

export class FilterOptionsPenaltyDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsNumber })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsNumber)
  penalty?: MatchOptionsNumber;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  reason?: MatchOptionsString;

  @ApiPropertyOptional({ type: FilterOptionsStudentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsStudentDto)
  student?: FilterOptionsStudentDto;
}

export class OrderOptionsPenaltyDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  penalty?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  reason?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsStudentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsStudentDto)
  student?: OrderOptionsStudentDto;
}

export class GetPenaltyQueryDto {
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

  @ApiPropertyOptional({ type: FilterOptionsPenaltyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsPenaltyDto)
  filterBy?: FilterOptionsPenaltyDto;

  @ApiPropertyOptional({ type: OrderOptionsPenaltyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsPenaltyDto)
  orderBy?: OrderOptionsPenaltyDto;
}
