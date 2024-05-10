import { NestedEmail, NestedEnum, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { DepartmentEnum } from "src/enums";

class UpdateUserDto {
  @NestedString({ optional: true })
  name?: string;

  @NestedEmail({ optional: true })
  email?: string;

  @NestedString({ optional: true })
  contact?: string;
}

export class UpdateFacultiesDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(DepartmentEnum, { optional: true })
  department?: DepartmentEnum;

  @NestedObject({ type: UpdateUserDto, optional: true })
  user?: UpdateUserDto;
}
