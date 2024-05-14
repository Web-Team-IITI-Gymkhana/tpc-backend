import { NestedEnum, NestedUUID } from "src/decorators/dto";
import { DepartmentEnum, TpcMemberRoleEnum } from "src/enums";

export class UpdateTpcMembersDto {
  @NestedUUID({})
  id: string;

  @NestedUUID({ optional: true })
  userId?: string;

  @NestedEnum(TpcMemberRoleEnum, { optional: true })
  role?: TpcMemberRoleEnum;

  @NestedEnum(DepartmentEnum, { optional: true })
  department?: DepartmentEnum;
}
