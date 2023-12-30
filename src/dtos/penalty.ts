import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class PenaltyIdParamDto {
  @ApiProperty({
    type: String,
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
    type: String,
  })
  @ApiPropertyOptional()
  studentId?: string;

  @ApiProperty({
    type: String,
  })
  @ApiPropertyOptional()
  reason?: string;
}
