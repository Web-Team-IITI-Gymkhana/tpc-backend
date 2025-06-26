import { NestedEnum, NestedString } from "src/decorators/dto";
import { CourseEnum, DepartmentEnum } from "src/enums";

export class CreateProgramsDto {
  @NestedString({})
  branch: string;

  @NestedEnum(CourseEnum, {})
  course: CourseEnum;

  @NestedString({})
  year: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;
}
