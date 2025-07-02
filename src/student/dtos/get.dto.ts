import {
  NestedBoolean,
  NestedEmail,
  NestedEnum,
  NestedNumber,
  NestedObject,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";
import { CategoryEnum, CourseEnum, DepartmentEnum, GenderEnum, BacklogEnum } from "src/enums";

class UserDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;
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

export class GetStudentsDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  rollNo: string;

  @NestedEnum(CategoryEnum, {})
  category: CategoryEnum;

  @NestedEnum(GenderEnum, {})
  gender: GenderEnum;

  @NestedNumber({})
  cpi: number;

  @NestedEnum(BacklogEnum, { optional: true })
  backlog?: BacklogEnum;

  @NestedNumber({ optional: true })
  tenthMarks?: number;

  @NestedNumber({ optional: true })
  twelthMarks?: number;

  @NestedObject({ type: UserDto })
  user: UserDto;

  @NestedObject({ type: ProgramDto })
  program: ProgramDto;
}

class ResumesDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  filepath: string;

  @NestedString({ optional: true })
  name?: string;

  @NestedBoolean({})
  verified: boolean;
}

class PenaltiesDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  penalty: number;

  @NestedString({})
  reason: string;
}

export class GetStudentDto extends GetStudentsDto {
  @NestedNumber({})
  totalPenalty: number;

  @NestedObject({ type: ResumesDto, isArray: true })
  resumes: ResumesDto[];

  @NestedObject({ type: PenaltiesDto, isArray: true })
  penalties: PenaltiesDto[];
}
