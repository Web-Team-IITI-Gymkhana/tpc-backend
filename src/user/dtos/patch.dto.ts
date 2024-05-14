import { NestedEmail, NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { RoleEnum } from "src/enums";

export class UpdateUsersDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  name?: string;

  @NestedString({ optional: true })
  contact?: string;

  @NestedEmail({ optional: true })
  email?: string;

  @NestedEnum(RoleEnum, { optional: true })
  role?: RoleEnum;
}
