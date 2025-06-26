import { Type } from "class-transformer";
import {
  NestedNumber,
  NestedUUID,
  NestedEnum,
  NestedString,
  NestedDate,
  NestedBoolean,
  NestedObject,
  NestedEmail,
} from "src/decorators/dto";
import { CourseEnum, EventTypeEnum, SeasonTypeEnum, DepartmentEnum, IndustryDomainEnum } from "src/enums";

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

class JobDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;
}

export class GetEventsDto {
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

  @NestedBoolean({})
  visibleToRecruiter: boolean;

  @NestedObject({ type: JobDto })
  job: JobDto;
}

class ResumeDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  filepath: string;

  @NestedBoolean({})
  verified: boolean;
}

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

class ApplicationsDto {
  @NestedUUID({})
  id: string;

  @NestedObject({ type: StudentDto })
  student: StudentDto;

  @NestedObject({ type: ResumeDto })
  resume: ResumeDto;
}

export class GetEventDto extends GetEventsDto {
  @NestedObject({ type: ApplicationsDto, isArray: true })
  applications: ApplicationsDto[];
}
