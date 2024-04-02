import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { CategoryEnum, GenderEnum, RoleEnum } from "src/enums";
import { DepartmentEnum } from "src/enums/department.enum";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { createMatchOptionsEnum, MatchOptionsNumber, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

export class FilterOptionsUserDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  email?: MatchOptionsString;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  name?: MatchOptionsString;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  contact?: MatchOptionsString;

  @ApiPropertyOptional({ type: createMatchOptionsEnum(RoleEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(RoleEnum))
  role?: string;
}

export class FilterOptionsProgramDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  course?: MatchOptionsString;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  branch?: MatchOptionsString;

  @ApiPropertyOptional({ type: createMatchOptionsEnum(DepartmentEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(DepartmentEnum))
  department?: string;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  year?: MatchOptionsString;
}

export class OrderOptionsUserDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  email?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  name?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  contact?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  role?: OrderByEnum;
}

export class OrderOptionsProgramDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  course?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  branch?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  department?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  year?: OrderByEnum;
}

export class FilterOptionsStudentDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  //To be Removed
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  userId?: MatchOptionsUUID;

  //To be Removed
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  programId?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  rollNo?: MatchOptionsString;

  @ApiPropertyOptional({ type: createMatchOptionsEnum(CategoryEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(CategoryEnum))
  category?: string;

  @ApiPropertyOptional({ type: createMatchOptionsEnum(GenderEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(GenderEnum))
  gender?: string;

  @ApiPropertyOptional({ type: MatchOptionsNumber })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsNumber)
  cpi?: MatchOptionsNumber;

  @ApiPropertyOptional({ type: FilterOptionsProgramDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsProgramDto)
  program?: FilterOptionsProgramDto;

  @ApiPropertyOptional({ type: FilterOptionsUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsUserDto)
  user?: FilterOptionsUserDto;
}

export class OrderOptionsStudentDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  //To be Removed
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  userId?: OrderByEnum;

  //To be Removed
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  programId?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  rollNo?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  category?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  gender?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  cpi?: OrderByEnum;

  @ApiPropertyOptional({ type: OrderOptionsProgramDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsProgramDto)
  program?: OrderOptionsProgramDto;

  @ApiPropertyOptional({ type: OrderOptionsUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsUserDto)
  user?: OrderOptionsUserDto;
}

export class GetStudentQueryDto {
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

  @ApiPropertyOptional({ type: OrderOptionsStudentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsStudentDto)
  orderBy?: OrderOptionsStudentDto;

  @ApiPropertyOptional({ type: FilterOptionsStudentDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsStudentDto)
  filterBy?: FilterOptionsStudentDto;
}
