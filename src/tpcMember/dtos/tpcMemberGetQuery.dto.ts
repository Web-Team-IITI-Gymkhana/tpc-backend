import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { FilterOptionsUserDto } from "src/student/dtos/studentGetQuery.dto";
import { MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

export class FilterOptionsTpcMemberDto {
  @ApiPropertyOptional({
    type: MatchOptionsUUID,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({
    type: MatchOptionsUUID,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  userId?: MatchOptionsUUID;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  department?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  role?: MatchOptionsString;

  @ApiPropertyOptional({
    type: FilterOptionsUserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsUserDto)
  user?: FilterOptionsUserDto;
}

export class OrderOptionsTpcMemberDto {
  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  userId?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  role?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  department?: OrderByEnum;
}

export class GetTpcMemberQueryDto {
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
    type: FilterOptionsTpcMemberDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsTpcMemberDto)
  filterBy?: FilterOptionsTpcMemberDto;

  @ApiPropertyOptional({
    type: OrderOptionsTpcMemberDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsTpcMemberDto)
  orderBy?: OrderOptionsTpcMemberDto;
}
