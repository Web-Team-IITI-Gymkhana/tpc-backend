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
import {
  CategoryEnum,
  DepartmentEnum,
  EventTypeEnum,
  GenderEnum,
  JobCoordinatorRoleEnum,
  JobStatusTypeEnum,
  SeasonTypeEnum,
  TpcMemberRoleEnum,
} from "src/enums";
import { CompanyFilledDto, RecruiterFilledDto, SelectionProcedureDto } from "src/job/dtos/jaf.dto";

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

  @NestedObject({ type: ProgramDto })
  program: ProgramDto;

  @NestedObject({ type: UserDto })
  user: UserDto;
}

export class GetTpcMemberDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(TpcMemberRoleEnum, {})
  role: TpcMemberRoleEnum;

  @NestedObject({ type: StudentDto })
  student: StudentDto;
}

class SeasonDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  year: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: SeasonTypeEnum;
}

class CompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;
}
class RecruiterDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  designation: string;

  @NestedObject({ type: UserDto })
  user: UserDto;
}

export class GetJobsDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedObject({ type: CompanyFilledDto })
  companyDetailsFilled: CompanyFilledDto;

  @NestedObject({ type: RecruiterFilledDto })
  recruiterDetailsFilled: RecruiterFilledDto;

  @NestedBoolean({})
  active: boolean;

  @NestedEnum(JobStatusTypeEnum, {})
  currentStatus: JobStatusTypeEnum;

  @NestedNumber({ optional: true })
  noOfVacancies?: number;

  @NestedNumber({ optional: true })
  duration?: number;

  @NestedString({})
  location: string;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: RecruiterDto })
  recruiter: RecruiterDto;
}

class TpcMemberDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: TpcMemberRoleEnum;

  @NestedEnum(DepartmentEnum, {})
  department: DepartmentEnum;

  @NestedObject({ type: UserDto })
  user: UserDto;
}

class JobCoordinatorsDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(JobCoordinatorRoleEnum, {})
  role: JobCoordinatorRoleEnum;

  @NestedObject({ type: TpcMemberDto })
  tpcMember: TpcMemberDto;
}

class EventsDto {
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
}

class SalariesDto {
  @NestedUUID({})
  id: string;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedString({ optional: true })
  others?: string;

  @NestedUUID({ optional: true, isArray: true })
  programs?: string[];

  @NestedEnum(DepartmentEnum, { isArray: true })
  facultyApprovals: DepartmentEnum[];

  @NestedEnum(GenderEnum, { optional: true, isArray: true })
  genders: GenderEnum[];

  @NestedEnum(CategoryEnum, { optional: true, isArray: true })
  categories: CategoryEnum[];

  @NestedNumber({})
  minCPI: number;

  @NestedNumber({})
  tenthMarks: number;

  @NestedNumber({})
  twelthMarks: number;

  @NestedNumber({})
  baseSalary: number;

  @NestedNumber({})
  totalCTC: number;

  @NestedNumber({})
  takeHomeSalary: number;

  @NestedNumber({})
  grossSalary: number;

  @NestedNumber({})
  otherCompensations: number;
}

export class GetJobDto extends GetJobsDto {
  @NestedObject({ type: SelectionProcedureDto })
  selectionProcedure: SelectionProcedureDto;

  @NestedString({ optional: true })
  description?: string;

  @NestedString({ optional: true })
  attachment?: string;

  @NestedString({ optional: true })
  skills?: string;

  @NestedDate({ optional: true })
  offerLetterReleaseDate?: Date;

  @NestedDate({ optional: true })
  joiningDate?: Date;

  @NestedString({ optional: true })
  feedback?: string;

  @NestedObject({ type: EventsDto, isArray: true })
  events: EventsDto[];

  @NestedObject({ type: SalariesDto, isArray: true })
  salaries: SalariesDto[];
}
