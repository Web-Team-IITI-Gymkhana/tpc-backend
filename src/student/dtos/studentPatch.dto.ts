import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  contact?: string;
}

export class UpdateStudentDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  rollNo?: string;

  @ApiPropertyOptional({ type: String })
  @IsUUID()
  @IsOptional()
  programId?: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  cpi?: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ type: UpdateUserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;
}
