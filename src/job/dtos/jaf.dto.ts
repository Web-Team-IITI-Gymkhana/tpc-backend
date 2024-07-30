import { IsDateString } from "class-validator";
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
  CompanyCategoryEnum,
  DepartmentEnum,
  GenderEnum,
  SeasonTypeEnum,
  CountriesEnum,
  IndustryDomainEnum,
  InterviewTypesEnum,
  SelectionModeEnum,
  TestTypesEnum,
} from "src/enums";

export class AddressDto {
  @NestedString({})
  line1: string;

  @NestedString({ optional: true })
  line2?: string;

  @NestedString({})
  city: string;

  @NestedString({})
  state: string;

  @NestedEnum(CountriesEnum, {})
  country: CountriesEnum;
}

export class CompanyFilledDto {
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

export class RecruiterFilledDto {
  @NestedString({})
  name: string;

  @NestedEmail({})
  email: string;

  @NestedString({})
  contact: string;

  @NestedString({})
  designation: string;

  @NestedString({ optional: true })
  landline?: string;

  @NestedString({})
  poc_name: string;

  @NestedEmail({})
  poc_email: string;

  @NestedString({})
  poc_contact: string;

  @NestedString({})
  poc_designation: string;

  @NestedString({ optional: true })
  poc_landline?: string;
}

class RequirementsDto {
  @NestedNumber({ optional: true })
  numberOfMembers?: number;

  @NestedNumber({ optional: true })
  numberOfRooms?: number;

  @NestedString({ optional: true })
  otherRequirements?: string;
}

class TestDto {
  @NestedEnum(TestTypesEnum, {})
  type: TestTypesEnum;

  @NestedNumber({})
  duration: number;
}

class InterviewDto {
  @NestedEnum(InterviewTypesEnum, {})
  type: InterviewTypesEnum;

  @NestedNumber({})
  duration: number;
}

export class SelectionProcedureDto {
  @NestedEnum(SelectionModeEnum, {})
  selectionMode: SelectionModeEnum;

  @NestedBoolean({})
  shortlistFromResume: boolean;

  @NestedBoolean({})
  groupDiscussion: boolean;

  @NestedObject({ type: TestDto, isArray: true })
  tests: TestDto[];

  @NestedObject({ type: InterviewDto, isArray: true })
  interviews: InterviewDto[];

  @NestedObject({ type: RequirementsDto, optional: true })
  requirements?: RequirementsDto;

  @NestedString({ optional: true })
  others?: string;
}

class SalaryDto {
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

  @NestedString({ optional: true })
  salaryPeriod?: string;

  @NestedString({ optional: true })
  others?: string;

  @NestedEnum(GenderEnum, { isArray: true, optional: true })
  genders?: GenderEnum[];

  @NestedUUID({ isArray: true, optional: true })
  programs?: string[];

  @NestedEnum(CategoryEnum, { isArray: true, optional: true })
  categories?: CategoryEnum[];

  @NestedNumber({ optional: true })
  minCPI?: number;

  @NestedNumber({ optional: true })
  tenthMarks?: number;

  @NestedNumber({ optional: true })
  twelthMarks?: number;
}

class JobDto {
  @NestedUUID({})
  seasonId: string;

  companyId?: string;
  recruiterId?: string;

  @NestedString({})
  role: string;

  @NestedString({ optional: true })
  others?: string;

  @NestedObject({ type: CompanyFilledDto })
  companyDetailsFilled: CompanyFilledDto;

  @NestedObject({ type: RecruiterFilledDto })
  recruiterDetailsFilled: RecruiterFilledDto;

  @NestedObject({ type: SelectionProcedureDto })
  selectionProcedure: SelectionProcedureDto;

  @NestedString({ optional: true })
  description?: string;

  @NestedString({ optional: true })
  attachment?: string;

  @NestedString({ optional: true })
  skills?: string;

  @NestedString({})
  location: string;

  @NestedNumber({ optional: true })
  noOfVacancies?: number;

  @NestedDate({ optional: true })
  offerLetterReleaseDate?: Date;

  @NestedDate({ optional: true })
  joiningDate?: Date;

  @NestedNumber({ optional: true })
  duration?: number;
}

export class JafDto {
  @NestedObject({ type: JobDto })
  job: JobDto;

  @NestedObject({ type: SalaryDto, isArray: true })
  salaries: SalaryDto[];
}

class SeasonsDto {
  @NestedUUID({})
  id: string;

  @NestedEnum(SeasonTypeEnum, {})
  type: string;

  @NestedString({})
  year: string;
}

class ProgramsDto {
  @NestedUUID({})
  id: string;

  @NestedString({})
  branch: string;

  @NestedString({})
  course: string;

  @NestedString({})
  year: string;

  @NestedEnum(DepartmentEnum, {})
  department: string;
}

export class GetJafValuesDto {
  @NestedObject({ type: SeasonsDto, isArray: true })
  seasons: SeasonsDto[];

  @NestedObject({ type: ProgramsDto, isArray: true })
  programs: ProgramsDto[];

  @NestedEnum(GenderEnum, { isArray: true })
  genders: GenderEnum;

  @NestedEnum(CategoryEnum, { isArray: true })
  categories: CategoryEnum;

  @NestedEnum(TestTypesEnum, { isArray: true })
  testTypes: TestTypesEnum;

  @NestedEnum(IndustryDomainEnum, { isArray: true })
  domains: IndustryDomainEnum;

  @NestedEnum(InterviewTypesEnum, { isArray: true })
  interviewTypes: InterviewTypesEnum;

  @NestedEnum(CountriesEnum, { isArray: true })
  countries: CountriesEnum;
}
