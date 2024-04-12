import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { CreateUserDto } from "src/student/dtos/studentPost.dto";

export class CreateFacultyDto {
  @ApiProperty({ type: String })
  @IsString()
  department: string;

  @ApiProperty({ type: CreateUserDto })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
