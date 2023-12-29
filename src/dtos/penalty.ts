import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { UUID } from "sequelize";

export class penaltyIdParamDto {
  @ApiProperty({
    type: UUID,
  })
  penaltyId: string;
}

export class createPenaltyDto {
  @ApiProperty({
    type: Number,
  })
  penalty: number;

  @ApiProperty({
    type: String,
  })
  reason: string;
}

export class updatePenaltyDto {
  @ApiProperty({
    type: Number,
  })
  @ApiPropertyOptional()
  penalty?: number;

  @ApiProperty({
    type: UUID,
  })
  @ApiPropertyOptional()
  studentId?: string;

  @ApiProperty({
    type: String,
  })
  @ApiPropertyOptional()
  reason?: string;
}
