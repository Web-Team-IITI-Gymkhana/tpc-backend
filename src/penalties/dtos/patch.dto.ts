import { NestedNumber, NestedString, NestedUUID } from "src/decorators/dto";

export class UpdatePenaltiesDto {
  @NestedUUID({})
  id: string;

  @NestedUUID({ optional: true })
  studentId?: string;

  @NestedNumber({ optional: true })
  penalty?: number;

  @NestedString({ optional: true })
  reason?: string;
}
