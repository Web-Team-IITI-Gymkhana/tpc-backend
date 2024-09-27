import { ApiProperty } from "@nestjs/swagger";
import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { JobCoordinatorRoleEnum } from "src/enums";

export class CreateJobCoordinatorsDto {
  @NestedUUID({})
  jobId: string;

  @NestedUUID({})
  tpcMemberId: string;

  @NestedEnum(JobCoordinatorRoleEnum, {})
  role: JobCoordinatorRoleEnum;
}
export class CreateApplicationDto {
  @NestedUUID({})
  eventId: string;

  @NestedUUID({})
  resumeId: string;
}

export class CreateAttachmentDto {
  @ApiProperty({ type: "string", format: "binary" })
  jd: string;

  @NestedUUID({})
  jobId: string;
}
