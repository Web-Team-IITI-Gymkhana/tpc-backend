import { NestedBoolean, NestedEmail, NestedEnum, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { CourseEnum, DepartmentEnum, SeasonTypeEnum } from "src/enums";

class SeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

class UserDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedString({})
  contact: string;

  @NestedEmail({})
  email: string;
}

class ProgramDto {
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

class StudentDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  rollNo: string;

  @NestedObject({ type: UserDto })
  user: UserDto;

  @NestedObject({ type: ProgramDto })
  program: ProgramDto;
}

export class GetRegistrationsDto {
  @NestedUUID({})
  id: string;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

  @NestedObject({ type: StudentDto })
  student: StudentDto;

  @NestedBoolean({})
  registered: boolean;
}
