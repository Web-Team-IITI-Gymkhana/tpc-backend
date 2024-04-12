import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";
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
