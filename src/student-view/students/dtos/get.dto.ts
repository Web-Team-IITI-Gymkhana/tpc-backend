import { isArray } from "lodash";
import {
  NestedBoolean,
  NestedDate,
  NestedEmail,
  NestedEnum,
  NestedNumber,
  NestedObject,
  NestedString,
  NestedUrl,
  NestedUUID,
} from "src/decorators/dto";
import {
  BacklogEnum,
  CategoryEnum,
  CompanyCategoryEnum,
  DepartmentEnum,
  EventTypeEnum,
  GenderEnum,
  IndustryDomainEnum,
  JobCoordinatorRoleEnum,
  SeasonTypeEnum,
  TpcMemberRoleEnum,
} from "src/enums";
import { AddressDto, RecruiterFilledDto, SelectionProcedureDto } from "src/job/dtos/jaf.dto";

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

class RecruiterDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  designation: string;

  @NestedObject({ type: UserDto })
  user: UserDto;
}

class CompanyDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  name: string;

  @NestedEnum(CompanyCategoryEnum, {})
  category: CompanyCategoryEnum;

  @NestedString({})
  yearOfEstablishment: string;

  @NestedUrl({ optional: true })
  website?: string;

  @NestedNumber({ optional: true })
  size?: number;

  @NestedString({ optional: true })
  annualTurnover?: string;

  @NestedUrl({ optional: true })
  socialMediaLink?: string;

  @NestedEnum(IndustryDomainEnum, { isArray: true })
  domains: IndustryDomainEnum[];

  @NestedObject({ type: AddressDto })
  address: AddressDto;
}

export class GetJobsDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: string;

  @NestedString({ optional: true, isArray: true })
  attachments?: string[];

  @NestedString({ optional: true, isArray: true })
  skills?: string[];

  @NestedString({ optional: true })
  description?: string;

  @NestedObject({ type: RecruiterFilledDto, isArray: true, optional: true })
  recruiterDetailsFilled?: RecruiterFilledDto[];

  @NestedString({ optional: true })
  duration?: string;

  @NestedString({})
  location: string;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;

  @NestedObject({ type: RecruiterDto, optional: true })
  recruiter: RecruiterDto;
}

class StudentDto {
  @NestedUUID({})
  id: string;

  @NestedObject({ type: ProgramDto })
  program: ProgramDto;

  @NestedObject({ type: UserDto })
  user: UserDto;
}

class TpcMemberDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  role: TpcMemberRoleEnum;

  @NestedObject({ type: StudentDto })
  student: StudentDto;
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

  // PLACEMENT
  @NestedNumber({ optional: true })
  baseSalary: number;

  @NestedNumber({ optional: true })
  totalCTC: number;

  @NestedNumber({ optional: true })
  takeHomeSalary: number;

  @NestedNumber({ optional: true })
  grossSalary: number;

  @NestedNumber({ optional: true })
  joiningBonus?: number;

  @NestedNumber({ optional: true })
  performanceBonus?: number;

  @NestedNumber({ optional: true })
  relocation?: number;

  @NestedNumber({ optional: true })
  bondAmount?: number;

  @NestedNumber({ optional: true })
  esopAmount?: number;

  @NestedString({ optional: true })
  esopVestPeriod?: string;

  @NestedNumber({ optional: true })
  firstYearCTC?: number;

  @NestedNumber({ optional: true })
  retentionBonus?: number;

  @NestedNumber({ optional: true })
  deductions?: number;

  @NestedNumber({ optional: true })
  medicalAllowance?: number;

  @NestedString({ optional: true })
  bondDuration?: string;

  @NestedNumber({ optional: true })
  foreignCurrencyCTC?: number;

  @NestedString({ optional: true })
  foreignCurrencyCode?: string;

  @NestedNumber({ optional: true })
  otherCompensations: number;

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedString({ optional: true })
  others?: string;

  //INTERNSHIP

  @NestedNumber({ optional: true })
  stipend?: number;

  @NestedString({ optional: true })
  foreignCurrencyStipend?: string;

  @NestedNumber({ optional: true })
  accommodation?: number;

  @NestedNumber({ optional: true })
  tentativeCTC?: number;

  @NestedDate({ optional: true })
  PPOConfirmationDate?: Date;
}

class Feedbackdto {
  @NestedUUID({})
  id: string;

  @NestedUUID({})
  jobId: string;

  @NestedUUID({})
  studentId: string;

  @NestedString({})
  remarks: string;

  @NestedDate({})
  createdAt: Date;
}

export class GetJobDto extends GetJobsDto {
  @NestedObject({ type: RecruiterFilledDto, isArray: true })
  recruiterDetailsFilled: RecruiterFilledDto[];

  @NestedObject({ type: SelectionProcedureDto })
  selectionProcedure: SelectionProcedureDto;

  @NestedString({ optional: true, isArray: true })
  attachments?: string[];

  @NestedDate({ optional: true })
  offerLetterReleaseDate?: Date;

  @NestedDate({ optional: true })
  joiningDate?: Date;

  @NestedObject({ type: JobCoordinatorsDto, isArray: true })
  jobCoordinators: JobCoordinatorsDto[];

  @NestedObject({ type: EventsDto, isArray: true })
  events: EventsDto[];

  @NestedObject({ type: SalariesDto, isArray: true })
  salaries: SalariesDto[];

  @NestedObject({ type: Feedbackdto, isArray: true })
  feedbacks: Feedbackdto[];
}
