import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { FilterOptionsUserDto, OrderOptionsUserDto } from "src/student/dtos/studentGetQuery.dto";
import { MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

export class FilterOptionsCompanyDto {
  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  name?: MatchOptionsString;
}

export class FilterOptionsRecruiterDto {
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
  companyId?: MatchOptionsUUID;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  designation?: MatchOptionsString;

  @ApiPropertyOptional({
    type: MatchOptionsString,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  landline?: MatchOptionsString;

  @ApiPropertyOptional({
    type: FilterOptionsUserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsUserDto)
  user?: FilterOptionsUserDto;

  @ApiPropertyOptional({
    type: FilterOptionsCompanyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsCompanyDto)
  name?: FilterOptionsCompanyDto;
}

export class OrderOptionsCompanyDto {
  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  name?: OrderByEnum;
}

export class OrderOptionsRecruiterDto {
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
  companyId?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  designation?: OrderByEnum;

  @ApiPropertyOptional({
    enum: OrderByEnum,
    example: "ASC/DESC",
  })
  @IsOptional()
  @IsEnum(OrderByEnum)
  landline?: OrderByEnum;

  @ApiPropertyOptional({
    type: OrderOptionsUserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsUserDto)
  user?: OrderOptionsUserDto;

  @ApiPropertyOptional({
    type: OrderOptionsCompanyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsCompanyDto)
  company?: OrderOptionsCompanyDto;
}

export class GetRecruiterQueryDto {
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
    type: FilterOptionsRecruiterDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsRecruiterDto)
  filterBy?: FilterOptionsRecruiterDto;

  @ApiPropertyOptional({
    type: OrderOptionsRecruiterDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsRecruiterDto)
  orderBy?: OrderOptionsRecruiterDto;
}
