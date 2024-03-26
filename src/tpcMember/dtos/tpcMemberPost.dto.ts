import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateUserDto } from "src/student/dtos/studentPost.dto";

export class CreateTpcMemberDto {
  @ApiProperty({
    type: String,
  })
  department: string;

  @ApiProperty({
    type: String,
  })
  role: string;

  @ApiProperty({
    type: CreateUserDto,
  })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
