import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { RoleEnum } from "src/enums";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { createMatchOptionsEnum, MatchOptionsString, MatchOptionsUUID } from "src/utils/utils.dto";

const role = createMatchOptionsEnum(RoleEnum);

class FilterOptionsUserDto {
  @ApiPropertyOptional({ type: MatchOptionsUUID })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsUUID)
  id?: MatchOptionsUUID;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  name?: string;

  @ApiPropertyOptional({ type: MatchOptionsString })
  @IsOptional()
  @ValidateNested()
  @Type(() => MatchOptionsString)
  email?: string;

  @ApiPropertyOptional({ type: createMatchOptionsEnum(RoleEnum) })
  @IsOptional()
  @ValidateNested()
  @Type(() => createMatchOptionsEnum(RoleEnum))
  role?: typeof role;
}

class OrderOptionsUserDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  id?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  name?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  email?: OrderByEnum;

  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsOptional()
  @IsEnum(OrderByEnum)
  role?: OrderByEnum;
}

export class QueryUserDto {
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

  @ApiPropertyOptional({ type: FilterOptionsUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsUserDto)
  filterBy?: FilterOptionsUserDto;

  @ApiPropertyOptional({ type: OrderOptionsUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsUserDto)
  orderBy?: OrderOptionsUserDto;
}
