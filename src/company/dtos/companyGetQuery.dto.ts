import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, ValidateNested, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { OrderByEnum } from "src/enums/orderBy.enum";
import { MatchOptionsString, MatchOptionsNumber, MatchOptionsUUID } from "src/utils/utils.dto";

export class FilterOptionsCompanyDto {
  /*
   * Define filter options for each field in the Company entity
   * ...
   */
}

export class OrderOptionsCompanyDto {
  /*
   * Define order options for each field in the Company entity
   * ...
   */
}

export class GetCompanyQueryDto {
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

  @ApiPropertyOptional({ type: FilterOptionsCompanyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterOptionsCompanyDto)
  filterBy?: FilterOptionsCompanyDto;

  @ApiPropertyOptional({ type: OrderOptionsCompanyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderOptionsCompanyDto)
  orderBy?: OrderOptionsCompanyDto;
}
