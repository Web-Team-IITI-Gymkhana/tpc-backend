import { NestedEnum, NestedNumber, NestedUUID, NestedString, NestedBoolean, NestedDate } from "src/decorators/dto";
import { EventTypeEnum } from "src/enums";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional } from "class-validator";

export class UpdateEventsDto {
  @NestedUUID({})
  id: string;

  @NestedUUID({ optional: true })
  jobId?: string;

  @NestedNumber({ optional: true })
  roundNumber?: number;

  @NestedEnum(EventTypeEnum, { optional: true })
  type?: EventTypeEnum;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedDate({ optional: true })
  startDateTime?: Date;

  @NestedDate({ optional: true })
  endDateTime?: Date;

  @NestedBoolean({ optional: true })
  visibleToRecruiter?: boolean;

  @ApiPropertyOptional({
    description: "Additional data fields required for this event as key-value pairs",
    example: { "preferredLocation": "Enter your preferred work location", "skillLevel": "Rate your skill level (1-10)" }
  })
  @IsOptional()
  @IsObject()
  additionalData?: Record<string, string>;
}

export class AddApplicationsDto {
  @NestedUUID({ isArray: true })
  studentIds: string[];
}
