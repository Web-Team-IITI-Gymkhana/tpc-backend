import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Role } from "src/db/enums";

export class UserSignUpDto {
  @ApiProperty({
    type: String,
    description: "user email",
  })
  email: string;
  @ApiPropertyOptional({
    type: String,
  })
  name: string;
  @ApiProperty({
    enum: Object.values(Role),
  })
  @IsEnum(Role)
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
}
