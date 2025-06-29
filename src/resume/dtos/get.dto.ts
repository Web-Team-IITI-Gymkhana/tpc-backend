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
import { CategoryEnum, CourseEnum, DepartmentEnum, GenderEnum, SeasonTypeEnum } from "src/enums";

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

export class GetResumesDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  filepath: string;

  @NestedString({ optional: true })
  name?: string;

  @NestedBoolean({})
  verified: boolean;

  @NestedObject({ type: StudentDto })
  student: StudentDto;
}

class CompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;
}

class SeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

class SalariesDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedNumber({})
  totalCTC: number;

  @NestedUUID({ optional: true, isArray: true })
  programs?: string[];

  @NestedEnum(GenderEnum, { optional: true, isArray: true })
  genders?: GenderEnum[];

  @NestedEnum(CategoryEnum, { isArray: true, optional: true })
  categories?: CategoryEnum[];

  @NestedEnum(DepartmentEnum, { isArray: true })
  facultyApprovals: DepartmentEnum[];

  @NestedNumber({})
  minCPI: number;

  @NestedNumber({})
  tenthMarks: number;

  @NestedNumber({})
  twelthMarks: number;
}

class JobDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: SalariesDto, isArray: true })
  salaries: SalariesDto[];
}

class EventDto {
  @NestedUUID({})
  id: string;

  @NestedNumber({})
  roundNumber: number;

  @NestedDate({})
  startDateTime: Date;

  @NestedDate({})
  endDateTime: Date;
}

class ApplicationsDto {
  @NestedUUID({})
  id: string;

  @NestedObject({ type: JobDto })
  job: JobDto;

  @NestedObject({ type: EventDto })
  event: EventDto;
}

export class GetResumeDto extends GetResumesDto {
  @NestedObject({ type: ApplicationsDto, isArray: true })
  applications: ApplicationsDto[];
}
