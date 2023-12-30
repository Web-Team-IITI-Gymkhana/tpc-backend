import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsUUID, ValidateNested } from "class-validator";
import { UUID } from "sequelize";

export class PenaltyIdParamDto {
  @ApiProperty({
    type: UUID,
  })
  penaltyId: string;
}

export class CreatePenaltyDto {
  @ApiProperty({
    type: Number,
  })
  penalty: number;

  @ApiProperty({
    type: String,
  })
  reason: string;
}

export class CreatePenaltiesDto {
  @ApiProperty({
    isArray: true,
    type: CreatePenaltyDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreatePenaltyDto)
  penalties: CreatePenaltyDto[];
}

export class UpdatePenaltyDto {
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
