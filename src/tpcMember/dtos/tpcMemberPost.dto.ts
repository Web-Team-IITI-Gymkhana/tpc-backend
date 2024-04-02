import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsString, ValidateNested } from "class-validator";
import { TpcMemberRoleEnum } from "src/enums";
import { CreateUserDto } from "src/student/dtos/studentPost.dto";

export class CreateTpcMemberDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  department: string;

  @ApiProperty({
    enum: TpcMemberRoleEnum,
  })
  @IsEnum(TpcMemberRoleEnum)
  role: TpcMemberRoleEnum;

  @ApiProperty({
    type: CreateUserDto,
  })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
