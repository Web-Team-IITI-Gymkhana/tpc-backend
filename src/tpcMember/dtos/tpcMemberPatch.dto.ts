import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { UpdateUserDto } from "src/student/dtos/studentPatch.dto";

export class UpdateTpcMemberDto {
  @ApiProperty({
    type: String,
  })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    type: UpdateUserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user?: UpdateUserDto;
}
