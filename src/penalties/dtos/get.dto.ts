import { NestedEmail, NestedEnum, NestedNumber, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { DepartmentEnum } from "src/enums";

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

  @NestedString({})
  course: string;

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

export class GetPenaltiesDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  penalty: number;

  @NestedString({})
  reason: string;

  @NestedObject({ type: StudentDto })
  student: StudentDto;
}
