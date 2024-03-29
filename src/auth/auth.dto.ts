import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";
import { Role } from "src/enums";

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
    enum: Role,
  })
  role: Role;

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
    enum: Role,
  })
  @IsEnum(Role)
  role: Role;
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
