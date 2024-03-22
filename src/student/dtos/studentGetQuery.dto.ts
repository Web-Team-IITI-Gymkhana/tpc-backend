import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, ValidateNested, IsEnum, IsNumber } from "class-validator";
import { MatchOptionsString, MatchOptionsNumber, MatchOptionsUUID } from "src/utils/utils.dto";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { Type } from "class-transformer";
import { Category } from "src/enums";

export class FilterOptionsProgramDto {
  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  course?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  branch?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  year?: MatchOptionsString;
}

export class FilterOptionsUserDto {
  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  name?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  email?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  contact?: MatchOptionsString;
}

export class FilterOptionsStudentDto {
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
    type: MatchOptionsUUID,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  programId?: MatchOptionsUUID;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  rollNo?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsNumber,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsNumber)
  cpi?: MatchOptionsNumber;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  category?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  gender?: MatchOptionsString;

  @ApiPropertyOptional({
    type: FilterOptionsProgramDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsProgramDto)
  program?: FilterOptionsProgramDto;

  @ApiPropertyOptional({
    type: FilterOptionsUserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsUserDto)
  user?: FilterOptionsUserDto;
}

export class OrderOptionsProgramDto {
  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  course?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  branch?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  year?: OrderByEnum;
}

export class OrderOptionsUserDto {
  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  name?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  email?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  contact?: OrderByEnum;
}

export class OrderOptionsStudentDto {
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
  userId?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  programId?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  rollNo?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  category?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  cpi?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  gender?: OrderByEnum;

  @ApiPropertyOptional({
    type: OrderOptionsProgramDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsProgramDto)
  program?: OrderOptionsProgramDto;

  @ApiPropertyOptional({
    type: OrderOptionsUserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsUserDto)
  user?: OrderOptionsUserDto;
}

export class GetStudentQueryDto {
  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  from?: number;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  to?: number;

  @ApiPropertyOptional({
    type: FilterOptionsStudentDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsStudentDto)
  filterBy?: FilterOptionsStudentDto;

  @ApiPropertyOptional({
    type: OrderOptionsStudentDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsStudentDto)
  orderBy: OrderOptionsStudentDto;
}
