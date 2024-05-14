import { NestedUUID } from "src/decorators/dto";

export class ApplySalariesDto {
  @NestedUUID({})
  salaryId: string;

  @NestedUUID({})
  resumeId: string;
}
