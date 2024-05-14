import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { DepartmentEnum } from "src/enums";

export class GetProgramsDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  branch: string;

  @NestedString({})
  course: string;

  @NestedString({})
  year: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;
}
