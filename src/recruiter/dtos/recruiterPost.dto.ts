import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateUserDto } from "src/student/dtos/studentPost.dto";

export class CreateRecruiterDto {
  @ApiProperty({ type: String })
  @IsUUID()
  companyId: string;

  @ApiProperty({ type: String })
  @IsString()
  designation: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  landline?: string;

  @ApiProperty({ type: CreateUserDto })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
