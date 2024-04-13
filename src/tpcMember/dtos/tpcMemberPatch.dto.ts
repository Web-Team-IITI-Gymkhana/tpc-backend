import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { TpcMemberRoleEnum } from "src/enums";
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

  @ApiPropertyOptional({ enum: TpcMemberRoleEnum })
  @IsOptional()
  @IsEnum(TpcMemberRoleEnum)
  role?: TpcMemberRoleEnum;
}
