import { NestedEmail, NestedEnum, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { DepartmentEnum, TpcMemberRoleEnum } from "src/enums";

class UserDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedString({})
  contact: string;

  @NestedEmail({})
  email: string;
}

export class GetTpcMemberDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedEnum(TpcMemberRoleEnum, {})
  role: TpcMemberRoleEnum;

  @NestedObject({ type: UserDto })
  user: UserDto;
}
