import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";
import { CategoryEnum, GenderEnum, RoleEnum } from "src/enums";

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  contact: string;

  role: RoleEnum;
}

export class CreateStudentDto {
  @ApiProperty({ type: CreateUserDto })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ApiProperty({ type: String })
  @IsString()
  rollNo: string;

  @ApiProperty({ enum: CategoryEnum })
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @ApiProperty({ enum: GenderEnum })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ type: Number })
  @IsNumber()
  cpi: number;

  @ApiProperty({ type: String })
  @IsUUID()
  programId: string;
}
