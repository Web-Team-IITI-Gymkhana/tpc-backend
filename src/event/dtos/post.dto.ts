import { NestedDate, NestedEnum, NestedNumber, NestedString, NestedUUID, NestedBoolean } from "src/decorators/dto";
import { EventTypeEnum } from "src/enums";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional } from "class-validator";

export class CreateEventsDto {
  @NestedUUID({})
  jobId: string;

  @NestedNumber({})
  roundNumber: number;

  @NestedEnum(EventTypeEnum, {})
  type: EventTypeEnum;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedDate({})
  startDateTime: Date;

  @NestedDate({})
  endDateTime: Date;

  @NestedBoolean({})
  visibleToRecruiter: boolean;

  @ApiPropertyOptional({
    description: "Additional data fields required for this event as key-value pairs",
    example: { "preferredLocation": "Enter your preferred work location", "skillLevel": "Rate your skill level (1-10)" }
  })
  @IsOptional()
  @IsObject()
  additionalData?: Record<string, string>;
}
