import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsEnum, IsString, IsOptional, IsDate, IsBoolean, IsUUID } from "class-validator";
import { EventTypeEnum } from "src/enums";

export class CreateEventDto {
  @ApiProperty({ type: String })
  @IsUUID()
  jobId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  roundNumber: number;

  @ApiProperty({ enum: EventTypeEnum })
  @IsEnum(EventTypeEnum)
  type: EventTypeEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  metadata?: string;

  @ApiProperty({ type: String })
  @IsDate()
  startDateTime: Date;

  @ApiProperty({ type: String })
  @IsDate()
  endDateTime: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  visibleToRecruiter: boolean;
}
