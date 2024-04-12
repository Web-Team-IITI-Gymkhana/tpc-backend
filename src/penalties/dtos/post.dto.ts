import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID, IsString } from "class-validator";

export class CreatePenaltyDto {
  @ApiProperty({ type: String })
  @IsUUID()
  studentId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  penalty: number;

  @ApiProperty({ type: String })
  @IsString()
  reason: string;
}
