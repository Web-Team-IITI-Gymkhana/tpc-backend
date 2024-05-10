import { NestedEnum, NestedString } from "src/decorators/dto";
import { DepartmentEnum } from "src/enums";

export class CreateProgramsDto {
  @NestedString({})
  branch: string;

  @NestedString({})
  course: string;

  @NestedString({})
  year: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;
}
