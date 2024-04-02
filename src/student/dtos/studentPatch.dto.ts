import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CategoryEnum, GenderEnum, RoleEnum } from "src/enums";

export class UpdateUserDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  contact?: string;
}

export class UpdateStudentDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ type: UpdateUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  rollNo?: string;

  @ApiPropertyOptional({ enum: CategoryEnum })
  @IsOptional()
  @IsEnum(CategoryEnum)
  category?: CategoryEnum;

  @ApiPropertyOptional({ enum: GenderEnum })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  cpi?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  programId?: string;
}
