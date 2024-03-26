import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { ApiFilterQuery } from "./api-filter-query";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderByEnum } from "src/enums/orderBy.enum";

function parseEnum(ourEnum) {
  const arr = Object.keys(ourEnum);

  return "ENUM: " + arr.join(" | ");
}

/*
 * class TwoLevelDeepDto {
 *   @ApiPropertyOptional({ enum: OrderByEnum })
 *   name: OrderByEnum;
 * }
 */

class OneLevelDeepDto {
  @ApiPropertyOptional({ enum: OrderByEnum })
  @IsEnum(OrderByEnum)
  type?: OrderByEnum;
}

class ThingFiltersDto {
  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: OrderByEnum })
  someenum: OneLevelDeepDto;
}

@Controller()
export class FlowerController {
  @Get("things")
  @ApiOperation({ summary: " List/Filter" })
  @ApiFilterQuery("q", ThingFiltersDto)
  async list(@Query("q") filters: ThingFiltersDto): Promise<void> {
    console.log(filters);
    /*
     * from: filters[name]=thing1&filters[description]=thing2
     * to: { name: "thing1", description: "thing2"
     */
  }
}
