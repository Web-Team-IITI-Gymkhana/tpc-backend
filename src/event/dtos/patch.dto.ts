import { NestedEnum, NestedNumber, NestedUUID, NestedString, NestedBoolean, NestedDate } from "src/decorators/dto";
import { EventTypeEnum } from "src/enums";

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
}

export class AddApplicationsDto {
  @NestedUUID({ isArray: true })
  studentIds: string[];
}
