import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { DepartmentEnum, TpcMemberRoleEnum } from "src/enums";

export class CreateTpcMembersDto {
  @NestedUUID({})
  studentId: string;

  @NestedEnum(TpcMemberRoleEnum, {})
  role: TpcMemberRoleEnum;
}
