import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { DepartmentEnum, TpcMemberRoleEnum } from "src/enums";

export class CreateTpcMembersDto {
  @NestedUUID({})
  userId: string;

  @NestedEnum(TpcMemberRoleEnum, {})
  role: TpcMemberRoleEnum;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;
}
