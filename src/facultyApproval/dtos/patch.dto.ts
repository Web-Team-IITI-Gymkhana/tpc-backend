import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { FacultyApprovalStatusEnum } from "src/enums";

export class UpdateFacultyApprovalsDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  remarks?: string;

  @NestedEnum(FacultyApprovalStatusEnum, { optional: true })
  status?: FacultyApprovalStatusEnum;
}
