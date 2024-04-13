import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { EventTypeEnum } from "src/enums";

export class UpdateEventsDto {
  @ApiProperty({ type: String })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  roundNumber?: number;

  @ApiPropertyOptional({ enum: EventTypeEnum })
  @IsOptional()
  @IsEnum(EventTypeEnum)
  type?: EventTypeEnum;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  metadata?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDate()
  startDateTime?: Date;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDate()
  endDateTime?: Date;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  visibleToRecruiter?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  jobId?: string;
}

export class AddApplicantsDto {
  @ApiProperty({ type: String, isArray: true })
  @IsEmail({}, { each: true })
  @IsArray()
  emails: string[];
}
