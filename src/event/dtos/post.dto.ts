import { NestedDate, NestedEnum, NestedNumber, NestedString, NestedUUID, NestedBoolean } from "src/decorators/dto";
import { EventTypeEnum } from "src/enums";

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
}
