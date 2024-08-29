import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { NestedEmail, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { RoleEnum } from "src/enums";

export class UserSignUpDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  email: string;
  @ApiPropertyOptional({
    type: String,
  })
  name: string;
  @ApiProperty({
    enum: RoleEnum,
  })
  role: RoleEnum;

  @ApiPropertyOptional()
  contact: string;
}

export class UserLogInDto {
  @ApiProperty({
    type: String,
    description: "user email",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: RoleEnum,
  })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}

export class PasswordlessLoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class PasswordlessLoginVerifyDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  token: string;
}

class CreateUserDto {
  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;

  role: string;
}

export class CreateRecruitersDto {
  @NestedString({})
  designation: string;

  @NestedString({ optional: true })
  landline?: string;

  @NestedUUID({})
  companyId: string;

  @NestedObject({ type: CreateUserDto })
  user: CreateUserDto;
}
