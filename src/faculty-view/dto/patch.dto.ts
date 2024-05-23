import { NestedEmail, NestedEnum, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { FacultyApprovalStatusEnum } from "src/enums";

export class UpdateFacultyApprovalStatusDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(FacultyApprovalStatusEnum, { optional: false })
  status?: FacultyApprovalStatusEnum;
}

class UpdateUserDto {
  @NestedString({ optional: true })
  name?: string;

  @NestedEmail({ optional: true })
  email?: string;

  @NestedString({ optional: true })
  contact?: string;
}

export class UpdateFacultyDto {
  @NestedUUID({})
  id: string;

  @NestedObject({ type: UpdateUserDto, optional: true })
  user?: UpdateUserDto;
}
