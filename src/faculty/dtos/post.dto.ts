import { NestedEmail, NestedEnum, NestedObject, NestedString } from "src/decorators/dto";
import { DepartmentEnum, RoleEnum } from "src/enums";

class CreateUserDto {
  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;

  role?: RoleEnum;
}

export class CreateFacultiesDto {
  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedObject({ type: CreateUserDto })
  user: CreateUserDto;
}
