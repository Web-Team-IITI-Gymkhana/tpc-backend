import {
  NestedBoolean,
  NestedDate,
  NestedEmail,
  NestedEnum,
  NestedNumber,
  NestedObject,
  NestedString,
  NestedUUID,
} from "src/decorators/dto";
import { CategoryEnum, DepartmentEnum, EventTypeEnum, GenderEnum, SeasonTypeEnum } from "src/enums";

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

export class GetStudentEventsDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  roundNumber: number;

  @NestedEnum(EventTypeEnum, {})
  type: EventTypeEnum;

  @NestedString({ optional: true })
  metadata?: string;

  @NestedDate({})
  startDateTime: Date;

  @NestedDate({})
  endDateTime: Date;

  @NestedString({ optional: true })
  studentStatus?: string;
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

class PenaltiesDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  penalty: number;

  @NestedString({})
  reason: string;
}

class SeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

class RegistrationsDto {
  @NestedUUID({})
  id: string;

  @NestedBoolean({})
  registered: boolean;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;
}

export class StudentViewDto {
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

  @NestedNumber({})
  tenthMarks: number;

  @NestedNumber({})
  twelthMarks: number;

  @NestedObject({ type: UserDto })
  user: UserDto;

  @NestedObject({ type: ProgramDto })
  program: ProgramDto;

  @NestedObject({ type: PenaltiesDto, isArray: true })
  penalties: PenaltiesDto[];

  @NestedObject({ type: RegistrationsDto, isArray: true })
  registrations: RegistrationsDto[];
}

export class GetStudentResumesDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  filepath: string;

  @NestedString({})
  name: string;

  @NestedBoolean({})
  verified: boolean;
}
