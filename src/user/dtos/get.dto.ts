import { NestedEmail, NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { RoleEnum } from "src/enums";

export class GetUsersDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;

  @NestedEnum(RoleEnum, {})
  role: RoleEnum;
}
