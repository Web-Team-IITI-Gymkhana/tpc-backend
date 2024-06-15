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
  SeasonTypeEnum,
  JobStatusTypeEnum,
  JobCoordinatorRoleEnum,
  TpcMemberRoleEnum,
  DepartmentEnum,
  EventTypeEnum,
  GenderEnum,
  CategoryEnum,
} from "src/enums";
import { SelectionProcedureDto } from "src/job/dtos/jaf.dto";

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

export class GetRecruiterDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  designation: string;

  @NestedString({ optional: true })
  landline: string;

  @NestedObject({ type: UserDto })
  user: UserDto;
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

export class GetJobsDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedBoolean({})
  active: boolean;

  @NestedEnum(JobStatusTypeEnum, {})
  currentStatus: JobStatusTypeEnum;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;
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

  @NestedEnum(GenderEnum, { optional: true, isArray: true })
  genders: GenderEnum[];

  @NestedEnum(CategoryEnum, { optional: true, isArray: true })
  categories: CategoryEnum[];

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

  @NestedString({})
  location: string;

  @NestedNumber({ optional: true })
  noOfVacancies?: number;

  @NestedNumber({ optional: true })
  duration?: number;

  @NestedString({ optional: true })
  feedback?: string;

  @NestedObject({ type: JobCoordinatorsDto, isArray: true })
  jobCoordinators: JobCoordinatorsDto[];

  @NestedObject({ type: EventsDto, isArray: true })
  events: EventsDto[];

  @NestedObject({ type: SalariesDto, isArray: true })
  salaries: SalariesDto[];
}

class ResumeDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  filepath: string;

  @NestedBoolean({})
  verified: boolean;
}

class ApplicationDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  studentId: string;

  @NestedObject({ type: ResumeDto })
  resume: ResumeDto;
}

export class GetEventDto {
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

  @NestedObject({ type: ApplicationDto, isArray: true })
  applications: ApplicationDto[];
}
