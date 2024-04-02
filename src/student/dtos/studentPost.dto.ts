import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNumber, IsString, ValidateNested } from "class-validator";
import { RoleEnum } from "src/enums";

export class CreateUserDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  contact: string;

  role?: RoleEnum;
}

export class CreateStudentDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  rollNo: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  programId: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  category: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  cpi: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  gender: string;

  @ApiProperty({
    type: CreateUserDto,
  })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
