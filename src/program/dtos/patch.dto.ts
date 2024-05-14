import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { DepartmentEnum } from "src/enums";

export class UpdateProgramsDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  branch?: string;

  @NestedString({ optional: true })
  course?: string;

  @NestedString({ optional: true })
  year?: string;

  @NestedEnum(DepartmentEnum, { optional: true })
  department?: DepartmentEnum;
}
