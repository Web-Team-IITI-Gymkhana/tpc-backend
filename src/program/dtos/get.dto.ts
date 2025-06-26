import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { CourseEnum, DepartmentEnum } from "src/enums";

export class GetProgramsDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  branch: string;

  @NestedEnum(CourseEnum, {})
  course: CourseEnum;

  @NestedString({})
  year: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;
}
