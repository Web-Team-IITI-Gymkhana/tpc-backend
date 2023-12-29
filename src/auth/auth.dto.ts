import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { Role } from "src/db/enums";

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
  email: string;
  @ApiProperty({
    enum: Role,
  })
  role: Role;
}
