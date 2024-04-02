import { ApiPropertyOptional } from "@nestjs/swagger";
import { plainToClass, plainToInstance, Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { randomUUID } from "crypto";
import { symlink } from "fs";

export class MatchOptionsString {
  @ApiPropertyOptional({
    type: Array<string>,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  eq?: Array<string>;
}

export class MatchOptionsNumber {
  @ApiPropertyOptional({
    type: Array<number>,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  @Type(() => Number)
  eq?: Array<number>;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lt?: number;

  @ApiPropertyOptional({
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gt?: number;
}

export class MatchOptionsUUID {
  @ApiPropertyOptional({
    type: Array<string>,
  })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  eq?: string[];
}

export function createMatchOptionsEnum<Enum>(enumType) {
  class MatchOptionsEnum {
    @ApiPropertyOptional({
      enum: enumType,
      isArray: true,
    })
    @IsOptional()
    @IsEnum(enumType)
    @Type(() => enumType)
    eq?: Enum;
  }

  return MatchOptionsEnum;
}
