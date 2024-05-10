import { NestedNumber, NestedString, NestedUUID } from "src/decorators/dto";

export class CreatePenaltiesDto {
  @NestedUUID({})
  studentId: string;

  @NestedNumber({})
  penalty: number;

  @NestedString({})
  reason: string;
}
