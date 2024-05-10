import { NestedEmail, NestedEnum, NestedString } from "src/decorators/dto";
import { RoleEnum } from "src/enums";

export class CreateUsersDto {
  @NestedString({})
  name: string;

  @NestedString({})
  contact: string;

  @NestedEmail({})
  email: string;

  @NestedEnum(RoleEnum, {})
  role: RoleEnum;
}
