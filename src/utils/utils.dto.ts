import { ApiPropertyOptional } from "@nestjs/swagger";
import { plainToClass, plainToInstance, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
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

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  lk?: string;
}

export class MatchOptionsNumber {
  @ApiPropertyOptional({
    type: Number,
    isArray: true,
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

export function createMatchOptionsEnum(enumType) {
  class MatchOptionsEnum {
    @ApiPropertyOptional({
      enum: enumType,
      isArray: true,
    })
    @IsOptional()
    @IsEnum(enumType, { each: true })
    @Type(() => enumType)
    eq?: Array<typeof enumType>;
  }

  return MatchOptionsEnum;
}

export class MatchOptionsBool {
  @ApiPropertyOptional({ type: Boolean, isArray: true })
  @IsArray()
  @IsOptional()
  @IsBoolean({ each: true })
  @Type(() => Boolean)
  eq?: boolean[];
}
