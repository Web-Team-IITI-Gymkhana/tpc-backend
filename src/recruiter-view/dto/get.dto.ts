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
  SeasonTypeEnum,
  JobStatusTypeEnum,
  JobCoordinatorRoleEnum,
  TpcMemberRoleEnum,
  DepartmentEnum,
  EventTypeEnum,
  GenderEnum,
  CategoryEnum,
  IndustryDomainEnum,
  CompanyCategoryEnum,
  BacklogEnum,
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

class AddressDto {
  @NestedString({ optional: true })
  city?: string;

  @NestedString({ optional: true })
  line1?: string;

  @NestedString({ optional: true })
  line2?: string;

  @NestedString({ optional: true })
  state?: string;

  @NestedString({ optional: true })
  country?: string;

  @NestedString({ optional: true })
  zipCode?: string;
}

class GetCompanyDto {
  @NestedString({ optional: true })
  name?: string;

  @NestedString({ optional: true })
  website?: string;

  @NestedEnum(IndustryDomainEnum, { isArray: true, optional: true })
  domains?: IndustryDomainEnum[];

  @NestedEnum(CompanyCategoryEnum, { optional: true })
  category?: CompanyCategoryEnum;

  @NestedObject({ type: AddressDto, optional: true })
  address?: AddressDto;

  @NestedNumber({ optional: true })
  size?: number;

  @NestedString({ optional: true })
  yearOfEstablishment?: string;

  @NestedString({ optional: true })
  annualTurnover?: string;

  @NestedString({ optional: true })
  socialMediaLink?: string;
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

  @NestedObject({ type: GetCompanyDto, optional: true })
  company: GetCompanyDto;
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

  @NestedBoolean({})
  active: boolean;

  @NestedEnum(JobStatusTypeEnum, {})
  currentStatus: JobStatusTypeEnum;

  @NestedObject({ type: SeasonDto })
  season: SeasonDto;

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

class TpcStudentDto {
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

  @NestedObject({ type: TpcStudentDto })
  student: TpcStudentDto;
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

  @NestedUUID({ optional: true, isArray: true })
  programs?: string[];

  @NestedEnum(GenderEnum, { optional: true, isArray: true })
  genders: GenderEnum[];

  @NestedEnum(CategoryEnum, { optional: true, isArray: true })
  categories: CategoryEnum[];

  @NestedEnum(BacklogEnum, { optional: true })
  isBacklogAllowed?: BacklogEnum;

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
  accommodation?: number;

  @NestedNumber({ optional: true })
  tentativeCTC?: number;

  @NestedDate({ optional: true })
  PPOConfirmationDate?: Date;
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

class StudentDto {
  @NestedUUID({ optional: true })
  id?: string;

  @NestedString({ optional: true })
  rollNo?: string;

  @NestedObject({ type: ProgramDto, optional: true })
  program?: ProgramDto;

  @NestedObject({ type: UserDto, optional: true })
  user?: UserDto;
}

class ApplicationDto {
  @NestedUUID({})
  id: string;

  @NestedObject({ type: StudentDto, optional: true })
  student?: StudentDto;

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
