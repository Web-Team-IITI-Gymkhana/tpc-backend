import { NestedString, NestedUUID } from "src/decorators/dto";

export class CreateFacultyApprovalsDto {
  @NestedUUID({})
  facultyId: string;

  @NestedString({ optional: true })
  remarks?: string;
}
