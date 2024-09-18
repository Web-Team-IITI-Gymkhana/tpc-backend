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
  CategoryEnum,
  DepartmentEnum,
  EventTypeEnum,
  GenderEnum,
  JobStatusTypeEnum,
  SeasonTypeEnum,
  TpcMemberRoleEnum,
  JobCoordinatorRoleEnum,
  BacklogEnum,
  CompanyCategoryEnum,
  IndustryDomainEnum,
} from "src/enums";
import { AddressDto, RecruiterFilledDto, SelectionProcedureDto } from "./jaf.dto";
import { JobRegistrationEnum } from "src/enums/jobRegistration.enum";

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

  @NestedObject({ type: RecruiterFilledDto })
  recruiterDetailsFilled: RecruiterFilledDto;

  @NestedBoolean({})
  active: boolean;

  @NestedEnum(JobRegistrationEnum, {})
  registration: JobRegistrationEnum;

  @NestedEnum(JobStatusTypeEnum, {})
  currentStatus: JobStatusTypeEnum;

  @NestedNumber({ optional: true })
  minNoOfHires?: number;

  @NestedNumber({ optional: true })
  expectedNoOfHires?: number;

  @NestedString({ optional: true })
  duration?: string;

  @NestedString({})
  location: string;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

  @NestedObject({ type: RecruiterDto })
  recruiter: RecruiterDto;

  @NestedObject({ type: CompanyDto })
  company: CompanyDto;
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

  @NestedObject({ type: ProgramDto, isArray: true })
  programs?: ProgramDto[];

  @NestedEnum(DepartmentEnum, { isArray: true })
  facultyApprovals: DepartmentEnum[];

  @NestedEnum(BacklogEnum, { optional: true })
  isBacklogAllowed?: BacklogEnum;

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

  @NestedNumber({ optional: true })
  foreignCurrencyStipend?: number;

  @NestedNumber({ optional: true })
  accomodation?: number;

  @NestedNumber({ optional: true })
  tenetativeCTC?: number;

  @NestedDate({ optional: true })
  PPOConfirmationDate?: Date;
}

export class GetJobDto extends GetJobsDto {
  @NestedObject({ type: RecruiterFilledDto })
  recruiterDetailsFilled: RecruiterFilledDto;

  @NestedObject({ type: SelectionProcedureDto })
  selectionProcedure: SelectionProcedureDto;

  @NestedString({ optional: true })
  description?: string;

  @NestedString({ optional: true })
  attachment?: string;

  @NestedString({ optional: true, isArray: true })
  skills?: string[];

  @NestedDate({ optional: true })
  offerLetterReleaseDate?: Date;

  @NestedDate({ optional: true })
  joiningDate?: Date;

  @NestedString({ optional: true })
  feedback?: string;

  @NestedObject({ type: JobCoordinatorsDto, isArray: true })
  jobCoordinators: JobCoordinatorsDto[];

  @NestedObject({ type: EventsDto, isArray: true })
  events: EventsDto[];

  @NestedObject({ type: SalariesDto, isArray: true })
  salaries: SalariesDto[];
}
