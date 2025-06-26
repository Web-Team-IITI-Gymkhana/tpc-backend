import { NestedEnum, NestedString, NestedUUID } from "src/decorators/dto";
import { CourseEnum, DepartmentEnum } from "src/enums";

export class UpdateProgramsDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  branch?: string;

  @NestedEnum(CourseEnum, { optional: true })
  course?: CourseEnum;

  @NestedString({ optional: true })
  year?: string;

  @NestedEnum(DepartmentEnum, { optional: true })
  department?: DepartmentEnum;
}
