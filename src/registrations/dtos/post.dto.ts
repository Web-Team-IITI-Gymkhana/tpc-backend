import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateRegistrationDto {
  @ApiProperty({ type: String })
  @IsUUID()
  studentId: string;

  @ApiProperty({ type: String })
  @IsUUID()
  seasonId: string;
}
