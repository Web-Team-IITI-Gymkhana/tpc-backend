import { NestedEnum, NestedNumber, NestedObject, NestedString, NestedUUID } from "src/decorators/dto";
import { DepartmentEnum, EventTypeEnum, GenderEnum, SeasonTypeEnum } from "src/enums";

export class ClashCompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;
}

export class ClashSeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

export class ClashJobDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedObject({ type: ClashCompanyDto })
  company: ClashCompanyDto;

  @NestedObject({ type: ClashSeasonDto })
  season: ClashSeasonDto;
}

export class ClashEventDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  roundNumber: number;

  @NestedEnum(EventTypeEnum, {})
  type: EventTypeEnum;
}

export class ClashProgramDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  course: string;

  @NestedString({})
  branch: string;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedString({})
  year: string;
}

export class ClashUserDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedString({})
  email: string;

  @NestedString({})
  contact: string;
}

export class ClashStudentDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  rollNo: string;

  @NestedEnum(GenderEnum, {})
  gender: GenderEnum;

  @NestedNumber({})
  cpi: number;

  @NestedObject({ type: ClashProgramDto })
  program: ClashProgramDto;

  @NestedObject({ type: ClashUserDto })
  user: ClashUserDto;
}

export class ClashApplicationDto {
  @NestedObject({ type: ClashEventDto })
  event: ClashEventDto;

  @NestedObject({ type: ClashStudentDto })
  student: ClashStudentDto;

  @NestedObject({ type: ClashJobDto })
  job: ClashJobDto;
}
